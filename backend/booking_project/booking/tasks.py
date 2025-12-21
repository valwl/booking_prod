from celery import shared_task
from django.utils import timezone
from . models import Booking


@shared_task
def check_pending_bookings():
    now = timezone.now()
    expired_bookings = Booking.objects.filter(status='pending', created_at__lt=now - timezone.timedelta(minutes=30))
    for booking in expired_bookings:
        booking.status = 'cancelled'
        booking.save()