from rest_framework.permissions import BasePermission
from rest_framework import permissions
from booking.models.booking import Booking


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class IsBookingUser(permissions.BasePermission):
    def has_permission(self, request, view):
        apartment_id = view.kwargs.get('apartment_id')
        user = request.user
        if Booking.objects.filter(apartment_id=apartment_id, user=user, status='complete').exists():
            return True
        return False
