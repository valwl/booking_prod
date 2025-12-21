from django.contrib import admin
from . models import Booking, UnavailableDate, Payment


admin.site.register(Booking)
admin.site.register(UnavailableDate)
admin.site.register(Payment)
