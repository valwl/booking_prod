# booking/services/booking/state_transitions.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from booking.models.booking import Booking
from booking.services.availability_service import AvailabilityService


channel_layer = get_channel_layer()


def cancel_booking(*, booking, reason: str = "user_cancelled"):
    if booking.status != Booking.STATUS_PENDING:
        return  # идемпотентно

    booking.status = Booking.STATUS_CANCELLED
    # booking.cancel_reason = reason
    # booking.save(update_fields=["status", "cancel_reason"])
    booking.save(update_fields=["status"])

    AvailabilityService.unblock_dates(booking=booking)

    async_to_sync(channel_layer.group_send)(
        f"booking_{booking.id}",
        {
            "type": "booking_event",
            "payload": {
                "type": "booking_cancel",
                "status": 'cancelled',
                "reason": reason,
                "booking_id": booking.id,
            }
        }
    )



# from booking.selectors.booking_selectors import get_booking_by_id
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from booking.models.booking import Booking
#
#
# channel_layer = get_channel_layer()
#
# def mark_booking_as_paid(booking_id):
#     booking = get_booking_by_id(booking_id)
#     if booking.status != Booking.STATUS_PENDING:
#         return
#     #booking.status = 'paid'
#     booking.status = Booking.STATUS_PAID
#     booking.save(update_fields=['status'])
#     async_to_sync(channel_layer.group_send)(
#         f"booking_{booking.id}",
#         {
#             "type": "booking_event",
#             "payload": {
#                 "type": "payment_success",
#                 "status": "paid",
#                 "booking_id": booking.id,
#             }
#         }
#     )




# expire booking , delete ?

from booking.models.booking import Booking
from booking.services.availability_service import AvailabilityService

from booking.selectors.booking_selectors import get_booking_by_id


def expire_booking(*, booking_id: int):
    booking = get_booking_by_id(booking_id)
    if booking.status != Booking.STATUS_PENDING:
        return

    booking.status = Booking.STATUS_CANCELLED
    booking.cancel_reason = "expired"
    booking.save(update_fields=["status", "cancel_reason"])

    AvailabilityService.unblock_dates(booking)