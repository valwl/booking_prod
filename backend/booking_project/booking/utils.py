from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_booking_email(user_email, booking_details):
    subject = 'Подтверждение вашего бронирования'
    message = render_to_string('booking_email_template.html', {'booking': booking_details, })
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user_email], fail_silently=False, )



