from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . views import BookingViewSet, get_apartment_availability
from booking.services.payment.payment_webhook import StripeWebhookView
from booking.services.payment.payment_service import payment_success, payment_cancel

router = DefaultRouter()
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('available_dates/<int:apartment_id>/', get_apartment_availability, name='available_dates'),
    path('webhook/stripe/', StripeWebhookView.as_view(), name='stripe_webhook'),

    path('payment/success/<int:booking_id>/', payment_success, name='payment_success'),
    path('payment/cancel/', payment_cancel, name='payment_cancel'),
]


'/booking_api/webhook/stripe/'