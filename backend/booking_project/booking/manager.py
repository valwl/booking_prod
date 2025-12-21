from django.db import models
from datetime import timedelta


class BookingManager(models.Manager):
    def create_booking(self, **kwargs):
        booking = self.create(**kwargs)
        booking.calculate_total_price()
        booking.save()
        self.create_unavailable_date(booking)
        return booking

    def create_unavailable_date(self, booking):
        from .models import UnavailableDate
        current_date = booking.checkin_day
        while current_date <= booking.checkout_day:
            UnavailableDate.objects.create(apartment=booking.apartment, date=current_date)
            current_date += timedelta(days=1)
        return booking

    def cancel_booking(self, booking):
        booking.status = 'cancelled'
        booking.save()