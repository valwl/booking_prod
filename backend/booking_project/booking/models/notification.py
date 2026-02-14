from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    EVENT_BOOKING_CREATED = 'booking_created'

    EVENT_BOOKING_PAID = 'booking_paid'

    EVENT_CHECKIN_REMINDER = 'checkin_reminder'

    EVENT_REVIEW_REQUEST = 'review_request'

    EVENT_CHOICES = [

        (EVENT_BOOKING_CREATED, 'Booking created'),

        (EVENT_BOOKING_PAID, 'Booking paid'),

        (EVENT_CHECKIN_REMINDER, 'Check-in reminder'),

        (EVENT_REVIEW_REQUEST, 'Review request'),

    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    event_type = models.CharField(max_length=50, choices=EVENT_CHOICES)

    payload = models.JSONField()

    sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)