from django.db import models
from . booking import Booking


# class Payment(models.Model):
#     booking = models.ForeignKey(Booking, related_name='payment', on_delete=models.CASCADE)
#     stripe_charge_id = models.CharField(max_length=255)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     timestamp = models.DateTimeField(auto_now_add=True)
#     # new
#     payment_url = models.CharField(max_length=256, null=True, blank=True)
#
#     def __str__(self):
#         return f'payment fot booking: {self.booking.id}'



class Payment(models.Model):
    STATUS_INITIATED = "initiated"
    STATUS_SESSION_CREATED = "session_created"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"
    STATUS_EXPIRED = "expired"

    STATUS_CHOICES = [
        (STATUS_INITIATED, "Initiated"),
        (STATUS_SESSION_CREATED, "Session created"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
        (STATUS_EXPIRED, "Expired"),
    ]

    booking = models.ForeignKey(
        Booking,
        related_name="payments",
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default=STATUS_INITIATED,
    )
    stripe_checkout_session_id = models.CharField(
        max_length=255, null=True, blank=True
    )
    stripe_payment_intent_id = models.CharField(
        max_length=255, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
         return f'payment fot booking: {self.booking.id}'

