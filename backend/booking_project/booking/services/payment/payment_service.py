from django.shortcuts import render
import stripe
import logging
from django.conf import settings



stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)



class PaymentService:
    # @staticmethod
    # def create_checkout_session(booking):
    #     session = stripe.checkout.Session.create(
    #
    #         payment_method_types=['card'],
    #         line_items=[{
    #
    #             'price_data': {
    #                 'currency': 'usd',
    #                 'product_data': {
    #
    #                     'name': f'Booking {booking.apartment.title}'
    #                 },
    #                 'unit_amount': int(booking.total_price * 100),
    #             },
    #             'quantity': 1,
    #         }],
    #         metadata={'booking_id': booking.id},
    #         mode='payment',
    #
    #         success_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/success/{booking.id}',
    #         cancel_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/cancel/',
    #     )
    #     return session.url
    #
    # @staticmethod
    # def retrieve_checkout_session(session_id):
    #     return stripe.checkout.Session.retrieve(session_id)


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
            # variant 1
            # success_url=(
            #     f"{settings.FRONTEND_URL}/payment/success/{booking.id}"
            # ),
            # cancel_url=(
            #     f"{settings.FRONTEND_URL}/payment/cancel"
            # ),

            # variant 2
            #         success_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/success/{booking.id}',
            #         cancel_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/cancel/',

            # variant 3
            success_url=f'http://127.0.0.1:8080/booking_api/payment/success/{booking.id}',
            cancel_url=f'http://127.0.0.1:8080/booking_api/payment/cancel/'
        )

    @staticmethod
    def retrieve_checkout_session(session_id: str):
        return stripe.checkout.Session.retrieve(session_id)


# нужны ли эти функции в принципе ?
def payment_success(request, booking_id):
    return render(request, 'payment_success.html', {'booking_id': booking_id})

def payment_cancel(request, booking_id):
    return render(request, 'payment_cancel.html', {'booking_Id': booking_id})


# что это ?
#'https://9f0e-2a01-540-44e1-eb00-6d32-bd0d-9eef-bcae.ngrok-free.app/webhook/stipe/'