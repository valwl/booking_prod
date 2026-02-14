# booking/services/booking/state_transitions.py
from django.utils import timezone
from booking.models.booking import Booking

from booking.selectors.booking_selectors import get_booking_by_id


def complete_booking(*, booking_id: int):
    booking = get_booking_by_id(booking_id)
    if booking.status != Booking.STATUS_PAID:
        return

    if timezone.now().date() < booking.checkout_day:
        return

    booking.status = Booking.STATUS_COMPLETED
    booking.save(update_fields=["status"])