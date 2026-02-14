from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser



from apartments.models.apartments import Apartment, PopularApartment
from apartments.services.create_apartment import create_apartment
from apartments.services.update_apartment import update_apartment

from apartments.permissions import IsOwnerOrReadOnly
from apartments.serializers import ApartmentDetailSerializer, \
    ApartmentSerializer, ApartmentUpdateInputSerializer, \
    ApartmentCreateInputSerializer, PopularApartmentSerializer






class ApartmentDeleteView(generics.DestroyAPIView):
    queryset = Apartment.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response({
            "detail": "Apartment delete success"
        }, status=status.HTTP_200_OK)


class ApartmentCreateListView(generics.ListCreateAPIView):
    queryset = Apartment.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApartmentCreateInputSerializer
        return ApartmentSerializer

    def perform_create(self, serializer):
        apartment = create_apartment(
            user=self.request.user,
            data=serializer.validated_data
        )
        self.instance = apartment


class ApartmentUpdateView(generics.UpdateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentUpdateInputSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_update(self, serializer):
        update_apartment(
            apartment=self.get_object(),
            data=serializer.validated_data
        )
