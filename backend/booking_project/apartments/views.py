from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from . serializers import (ApartmentCreateSerializers, ReviewSerializers, ApartmentSerializer,
                           LocationSerializer,  ApartmentUpdateSerializer, SliderImgSerializer, PopularApartmentSerializer)
from . models import Locations, Apartment, Review, SliderImage, PopularApartment
from . permissions import IsBookingUser, IsOwnerOrReadOnly


class LocationListView(generics.ListAPIView):
    queryset = Locations.objects.all()
    serializer_class = LocationSerializer


class LocationDetailView(generics.RetrieveAPIView):
    queryset = Locations.objects.all()
    serializer_class = LocationSerializer


class ApartmentCreateListView(generics.ListCreateAPIView):
    queryset = Apartment.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApartmentCreateSerializers
        return ApartmentSerializer

    def perform_create(self, serializer):
        apartment = serializer.save(user=self.request.user)
        response_serializer = ApartmentCreateSerializers(apartment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class UserApartmentList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        apartments = Apartment.objects.filter(user=user)
        serializer = ApartmentSerializer(apartments, many=True, context={'request': request})
        return Response(serializer.data)


class ApartmentDetailView(generics.RetrieveAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer


class ApartmentUpdateView(generics.UpdateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentUpdateSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ApartmentDeleteView(generics.DestroyAPIView):
    queryset = Apartment.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response({
            "detail": "Apartment delete success",
            "status": status.HTTP_200_OK
        }, status=status.HTTP_200_OK)


class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializers
    permission_classes = [IsAuthenticated, IsBookingUser]

    def perform_create(self, serializer):
        apartment_id = self.kwargs.get('apartment_id')
        apartment = Apartment.objects.get(id=apartment_id)
        serializer.save(user=self.request.user, apartment=apartment)



class ApartmentReviewView(generics.ListAPIView):
    serializer_class = ReviewSerializers

    def get_queryset(self):
        apartment_id = self.kwargs.get('apartment_id')
        return Review.objects.filter(apartment_id=apartment_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ImagesForClientSlider(generics.ListAPIView):
    queryset = SliderImage.objects.all()
    serializer_class = SliderImgSerializer


class PopularApartmentList(APIView):
    def get(self, request):
        popular_apartments = PopularApartment.objects.all()
        serializers = PopularApartmentSerializer(popular_apartments, many=True)
        return Response(serializers.data)




