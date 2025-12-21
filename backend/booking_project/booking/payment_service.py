import stripe
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from .models import Booking
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from channels.generic.websocket import WebsocketConsumer
import json
import logging
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)







class PaymentService:
    @staticmethod
    def create_checkout_session(booking):
        session = stripe.checkout.Session.create(

            payment_method_types=['card'],
            line_items=[{

                'price_data': {
                    'currency': 'usd',
                    'product_data': {

                        'name': f'Booking {booking.apartment.title}'
                    },
                    'unit_amount': int(booking.total_price * 100),
                },
                'quantity': 1,
            }],
            metadata={'booking_id': booking.id},
            mode='payment',

            success_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/success/{booking.id}',
            cancel_url=f'https://6d69-2603-8000-b4f0-6fe0-712f-7d0c-1d17-d80b.ngrok-free.app/booking_api/payment/cancel/',
        )
        return session.url


class StripeWebhookView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
        event = None

        logger.info("Webhook received")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
            logger.info(f"Webhook received: {event['type']} received")
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) # work witch stripe api

        if event['type'] == 'checkout.session.completed': # work wutch update status
            session = event['data']['object']
            order_id = session['metadata']['booking_id']
            try:
                Booking.objects.filter(id=order_id).update(status='paid')
            except Booking.DoesNotExist:
                return JsonResponse({'error': 'Booking not found'}, status=404)

            channel_layer = get_channel_layer() # work witch send message here all errors
            async_to_sync(channel_layer.group_send)(
                f'booking_{order_id}',
                {'type': 'booking_status', 'status': 'payment_success'}
            )

        return Response({'status': 'success'}, status=status.HTTP_200_OK)


#'https://9f0e-2a01-540-44e1-eb00-6d32-bd0d-9eef-bcae.ngrok-free.app/webhook/stipe/'



def payment_success(request, booking_id):
    return render(request, 'payment_success.html', {'booking_id': booking_id})

def payment_cancel(request, booking_id):
    return render(request, 'payment_cancel.html', {'booking_Id': booking_id})


