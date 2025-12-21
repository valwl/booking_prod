import stripe
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from rest_framework import status
from rest_framework import viewsets
from . serializers import BookingSerializer
from . models import Booking, Payment, UnavailableDate
from apartments.models import Apartment
from django.conf import settings
from .utils import send_booking_email
from .payment_service import PaymentService

stripe.api_key = settings.STRIPE_SECRET_KEY




@api_view(['GET'])
def check_booking_status(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        return Response({'status': booking.status}, status=200)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)



class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        booking.calculate_total_price()
        booking.save()

        current_date = booking.checkin_day
        while current_date < booking.checkout_day:
            UnavailableDate.objects.create(apartment=booking.apartment, date=current_date)
            current_date += timedelta(days=1)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def pay(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'pending':
            checkOutUrl = PaymentService.create_checkout_session(booking)
            return Response({'checkOutUrl': checkOutUrl})
        return Response({'error': 'Invalid booking status'}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def filter_by_status(self, request):
        status = request.query_params.get('status')
        if status:
            bookings = self.get_queryset().filter(status=status)
        else:
            bookings = self.get_queryset()
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ['pending']:
            booking.cancel()
            return Response({'status': 'booking cancelled'})
        return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
def get_available_date(request, apartment_id):
    try:
        apartment = Apartment.objects.get(id=apartment_id)
    except Apartment.DoesNotExist:
        return Response({'error': 'apartment not found'}, status=404)

    today = datetime.today()
    end_date = today + timedelta(days=90)
    all_dates = {today + timedelta(days=1) for i in range((end_date - today).days)}
    unavailable_dates = UnavailableDate.objects.filter(apartment=apartment, date__lt=end_date)
    booked_dates = {ud.date.date() for ud in unavailable_dates}
    available_dates = all_dates - booked_dates
    # print(Response({'available_dates': list(available_dates)}))
    available_dates_list = [date.strftime('%Y-%m-%d') for date in available_dates]
    booked_dates_list = [date.strftime('%Y-%m-%d') for date in booked_dates]
    return Response({'available_dates': available_dates_list,
                     'blocked_date': booked_dates_list})




