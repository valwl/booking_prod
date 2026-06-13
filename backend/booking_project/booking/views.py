import stripe
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from rest_framework import status
from rest_framework import viewsets
from django.conf import settings

from .models.booking import Booking
from . serializers import BookingCreateSerializer, BookingDetailSerializer, BookingListSerializer, AvailabilitySerializer
from .services.booking.booking_create import create_booking
from .services.booking.booking_cancel import cancel_booking
from .services.payment.start_booking_payment import start_or_get_booking_payment
from .services.availability_service import AvailabilityService
from .selectors.booking_selectors import get_user_bookings, get_booking_by_id
from booking.selectors.booking_selectors import get_user_bookings

from apartments.models.apartments import Apartment

stripe.api_key = settings.STRIPE_SECRET_KEY




class BookingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Booking.objects.all()

    def get_gueryset(self):
        status = self.request.query_params.get("status") # для чешо нужна жта строка
        return get_user_bookings(user=self.request.user, status=status)

    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingDetailSerializer


    def list(self, request):
        """
        user booking list
        """
        bookings = get_user_bookings(user=request.user)
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data)

    def create(self, request):
        """
        create booking
        """
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = create_booking(
            user=request.user,
            apartment=serializer.validated_data["apartment"],
            checkin=serializer.validated_data["checkin_day"],
            checkout=serializer.validated_data["checkout_day"],
        )

        checkout_url = start_or_get_booking_payment(booking=booking)

        return Response(
            {
                "booking": BookingDetailSerializer(booking).data,
                "checkout_url": checkout_url,
            },
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, pk=None):
        booking = get_booking_by_id(pk)
        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data)



    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        cancel booking
        """
        booking = get_booking_by_id(pk)
        cancel_booking(booking=booking)
        return Response(
            {"status": "booking canceled"},
            status=status.HTTP_200_OK
        )




    @action(detail=True, methods=['post'])
    def pay(self, pk=None):
        """
        get payment url
        """
        booking = get_booking_by_id(pk)
        if booking.status == 'pending':
            checkout_url = start_or_get_booking_payment(booking=booking)
            return Response({'checkout_url': checkout_url}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid booking status'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_apartment_availability(request, apartment_id):
    """
    Returns availability calendar for apartment
    """
    try:
        apartment = Apartment.objects.get(id=apartment_id)
    except Apartment.DoesNotExist:
        return Response(
            {"detail": "Apartment not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    availability = AvailabilityService.get_availability(
        apartment=apartment
    )
    serializer = AvailabilitySerializer(availability)
    return Response(serializer.data, status=status.HTTP_200_OK)

