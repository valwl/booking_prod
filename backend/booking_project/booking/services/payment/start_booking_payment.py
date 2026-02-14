from booking.models.payment import Payment
from booking.services.payment.payment_service import PaymentService
from booking.models.booking import Booking


# def start_or_get_booking_payment(*, booking) -> str:
#     if booking.status != Booking.STATUS_PENDING:
#         raise ValueError("Payment can be started only for pending booking")
#
#
#
#     # 1️⃣ ищем активную payment-попытку
#     payment = (
#         booking.payments
#         .filter(
#             status__in=[
#                 Payment.STATUS_INITIATED,
#                 Payment.STATUS_SESSION_CREATED,
#             ]
#         )
#         .order_by("-created_at")
#         .first()
#     )
#
#     # 2️⃣ если checkout уже есть — возвращаем его
#     if payment and payment.stripe_checkout_session_id:
#         session = PaymentService.retrieve_checkout_session(
#             payment.stripe_checkout_session_id
#         )
#         return session.url
#
#
#
#     # 3️⃣ создаём новую payment-попытку
#
#     payment = Payment.objects.create(
#         booking=booking,
#         amount=booking.total_price,
#         status=Payment.STATUS_INITIATED,
#
#     )
#
#
#
#     session = PaymentService.create_checkout_session(
#         booking=booking,
#         #payment=payment,
#     )
#
#     payment.stripe_checkout_session_id = session.id
#     payment.stripe_payment_intent_id = session.payment_intent
#     payment.status = Payment.STATUS_SESSION_CREATED
#
#     payment.save(
#         update_fields=[
#             "stripe_checkout_session_id",
#             "stripe_payment_intent_id",
#             "status",
#         ]
#     )
#
#     return session.url







def start_or_get_booking_payment(*, booking: Booking) -> str:
    if booking.status != Booking.STATUS_PENDING:
        raise ValueError("Payment can be started only for pending booking")

    # 1️⃣ ищем последнюю активную попытку
    payment = (
        booking.payments
        .filter(
            status__in=[
                Payment.STATUS_INITIATED,
                Payment.STATUS_SESSION_CREATED,
            ]
        )
        .order_by("-created_at")
        .first()
    )

    # 2️⃣ если есть Stripe session — проверяем её состояние
    if payment and payment.stripe_checkout_session_id:
        session = PaymentService.retrieve_checkout_session(
            payment.stripe_checkout_session_id
        )

        if session.status == "open":
            return session.url

        # ❌ session закрыта → помечаем payment
        payment.status = Payment.STATUS_EXPIRED
        payment.save(update_fields=["status"])

    # 3️⃣ создаём новую payment попытку
    payment = Payment.objects.create(
        booking=booking,
        amount=booking.total_price,
        status=Payment.STATUS_INITIATED,
    )

    session = PaymentService.create_checkout_session(
        booking=booking
    )

    payment.stripe_checkout_session_id = session.id
    payment.stripe_payment_intent_id = session.payment_intent
    payment.status = Payment.STATUS_SESSION_CREATED
    payment.save(
        update_fields=[
            "stripe_checkout_session_id",
            "stripe_payment_intent_id",
            "status",
        ]
    )

    return session.url
