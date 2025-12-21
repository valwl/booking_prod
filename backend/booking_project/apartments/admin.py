from django.contrib import admin
from . models import Apartment, ApartmentImg, LocationImg, Locations, Review, SliderImage, PopularApartment


admin.site.register(Apartment)
admin.site.register(ApartmentImg)
admin.site.register(Locations)
admin.site.register(LocationImg)
admin.site.register(Review)
admin.site.register(SliderImage)
admin.site.register(PopularApartment)
