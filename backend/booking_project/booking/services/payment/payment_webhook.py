import stripe
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from booking.events.stripe_event_handler import handle_stripe_event


stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        # endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.STRIPE_WEBHOOK_SECRET,
            )

        except stripe.error.SignatureVerificationError:
            logger.warning("Invalid Stripe signature")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            logger.warning("Invalid Stripe payload")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        handle_stripe_event(event)
        return Response(status=status.HTTP_200_OK)



# gutsy-amazed-evenly-pros

