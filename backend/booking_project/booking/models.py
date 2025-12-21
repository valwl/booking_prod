from django.db import models
from apartments.models import Apartment
from datetime import timedelta
from django.contrib.auth import get_user_model
from . manager import BookingManager
User = get_user_model()


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('complete', 'Complete'),
        ('cancelled', 'Cancelled'),
    ]
    checkin_day = models.DateTimeField()
    checkout_day = models.DateTimeField()
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
    create = models.DateTimeField(auto_now_add=True)

    objects = BookingManager()

    def __str__(self):
        return f'{self.apartment.title}'

    def calculate_total_price(self):
        days = (self.checkout_day - self.checkin_day).days
        weekday_days = sum(1 for i in range(days) if (self.checkin_day + timedelta(days=i)).weekday() < 5)
        weekend_days = days - weekday_days
        self.total_price = (weekday_days * self.apartment.base_price + weekend_days * self.apartment.weekend_price)
        return self.total_price

    def cancel(self):
        self.status = 'cancelled'
        self.save()
        UnavailableDate.objects.filter(apartment=self.apartment, date__gte=self.checkin_day, date__lt=self.checkout_day).delete()


class UnavailableDate(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        unique_together = ('apartment', 'date')

    def __str__(self):
        return f'{self.apartment} - {self.date}'


class Payment(models.Model):
    booking = models.OneToOneField(Booking, related_name='payment', on_delete=models.CASCADE)
    stripe_charge_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)


