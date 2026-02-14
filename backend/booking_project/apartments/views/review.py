from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.exceptions import ValidationError

from apartments.permissions import IsBookingUser
from apartments.serializers import ReviewCreateInputSerializer, ReviewSerializers
from apartments.services.create_review import create_review
from apartments.models.reviews import Review


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewCreateInputSerializer
    permission_classes = [IsAuthenticated, IsBookingUser]

    def perform_create(self, serializer):
        apartment_id = self.kwargs['apartment_id']
        user = self.request.user

        if Review.objects.filter(
            user=user,
            apartment_id=apartment_id
        ).exists():
            raise ValidationError({"detail": "You can leave only one review for this apartment."})
        create_review(
            user=self.request.user,
            apartment_id=self.kwargs['apartment_id'],
            data=serializer.validated_data
        )


class ApartmentReviewView(generics.ListAPIView):
    serializer_class = ReviewSerializers

    def get_queryset(self):
        apartment_id = self.kwargs.get('apartment_id')
        return Review.objects.filter(apartment_id=apartment_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)