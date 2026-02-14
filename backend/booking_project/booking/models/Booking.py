from django.db import models
from apartments.models.apartments  import Apartment

from django.contrib.auth import get_user_model

User = get_user_model()


# class Booking(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('paid', 'Paid'),
#         ('complete', 'Complete'),
#         ('cancelled', 'Cancelled'),
#     ]
#     checkin_day = models.DateTimeField()
#     checkout_day = models.DateTimeField()
#     apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     total_price = models.DecimalField(max_digits=10, decimal_places=2)
#     paid = models.BooleanField(default=False)
#     status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
#     create = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f'Booking #{self.pk}, {self.apartment}'




class Booking(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PAID = "paid"
    STATUS_COMPLETE = "complete"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PAID, "Paid"),
        (STATUS_COMPLETE, "Complete"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    checkin_day = models.DateField()
    checkout_day = models.DateField()
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    expires_at = models.DateTimeField(
        help_text="when unpaid booking expires",
        null=True,
        blank=True,
        db_index=True
    ) # expire сразу ставить 30 минут ?
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking #{self.pk}, {self.apartment}'