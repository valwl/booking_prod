from django.db import transaction
from booking.models.booking import Booking
from booking.services.booking.pricing_calculate import calculate_booking_price
#from booking.services.availability_service import AvailabilityService
from ..availability_service import AvailabilityService
from booking.tasks.expire_booking import cancel_unpaid_booking

# @transaction.atomic
# def create_booking(*, user, apartment, checkin, checkout):
#     availability = AvailabilityService()
#     if not availability.is_available(
#             apartment=apartment,
#             checkin=checkin,
#             checkout=checkout):
#         raise ValueError("Appartment not available")
#
#     price = calculate_booking_price(
#         apartment=apartment,
#         checkin=checkin,
#         checkout=checkout,
#     )
#
#     booking = Booking.objects.create(
#         user=user,
#         apartment=apartment,
#         checkin_day=checkin,
#         checkout_day=checkout,
#         total_price=price,
#         status=Booking.STATUS_PENDING,
#         # new
#
#     )
#
#     availability.block_dates(booking=booking)
#     return booking



@transaction.atomic
def create_booking(*, user, apartment, checkin, checkout):
    availability = AvailabilityService()
    if not availability.is_available(
            apartment=apartment,
            checkin=checkin,
            checkout=checkout):
        raise ValueError("Appartment not available")

    price = calculate_booking_price(
        apartment=apartment,
        checkin=checkin,
        checkout=checkout,
    )

    booking = Booking.objects.create(
        user=user,
        apartment=apartment,
        checkin_day=checkin,
        checkout_day=checkout,
        total_price=price,
        status=Booking.STATUS_PENDING,
        # new

    )

    availability.block_dates(booking=booking)
    # проработать на практике, а как в таком случае будет действовать transition.atomic ?
    transaction.on_commit(
        lambda: cancel_unpaid_booking.apply_async(
            args=(booking.id,),
            countdown=30
        ) # шоибка сейчас происходит здесь
    )
    return booking


















