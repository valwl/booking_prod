from django.shortcuts import render
import stripe
import logging
from django.conf import settings



stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)



class PaymentService:

    @staticmethod
    def create_checkout_session(*, booking) -> stripe.checkout.Session:

        return stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Booking {booking.apartment.title}",
                    },
                    "unit_amount": int(booking.total_price * 100),
                },
                "quantity": 1,
            }],
            metadata={
                "booking_id": booking.id,
            },

            success_url=f'http://127.0.0.1:8080/booking_api/payment/success/{booking.id}',
            cancel_url=f'http://127.0.0.1:8080/booking_api/payment/cancel/'
        )

    @staticmethod
    def retrieve_checkout_session(session_id: str):
        return stripe.checkout.Session.retrieve(session_id)


# разобрать как работает ? render
def payment_success(request, booking_id):
    return render(request, 'payment_success.html', {'booking_id': booking_id})

def payment_cancel(request, booking_id):
    return render(request, 'payment_cancel.html', {'booking_Id': booking_id})


