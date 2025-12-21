from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from . models import Booking, UnavailableDate
from . manager import BookingManager
from django.utils import timezone
booking_manager = BookingManager()


@receiver(post_save, sender=Booking)
def create_unavailable_date(sender, instance, created, **kwargs):
    if created:
        booking_manager.create_unavailable_date(instance)


@receiver(pre_delete, sender=Booking)
def delete_unavailable_dates(sender, instance, **kwargs):
    UnavailableDate.objects.filter(apartment=instance.apartment, date__gte=instance.checkin_day, date__lt=instance.checkout_day).delete()


@receiver(pre_delete, sender=Booking)
def check_booking_status(sender, instance, **kwargs):
    if instance.stattus == 'paid' and timezone.now().date() > instance.checkout_date:
        instance.status = 'complete'
        instance.save()