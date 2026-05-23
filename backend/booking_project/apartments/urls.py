from django.urls import path

from apartments.views.apartment_read import UserApartmentList, ApartmentDetailView, PopularApartmentList
from apartments.views.apartment_write import ApartmentDeleteView, ApartmentCreateListView, ApartmentUpdateView
from apartments.views.locations import LocationListView, LocationDetailView
from apartments.views.review import ReviewCreateView
from apartments.views.sliders import ImagesForClientSlider



urlpatterns = [
    path('apartment/', ApartmentCreateListView.as_view(), name='apartment'),
    path('apartment_update/<int:pk>/', ApartmentUpdateView.as_view(), name='apartment_update'),
    path('apartment_delete/<int:pk>/', ApartmentDeleteView.as_view(), name='apartment_delete'),

    path('apartment/user', UserApartmentList.as_view(), name='apartment'),
    path('apartment_detail/<int:pk>/', ApartmentDetailView.as_view(), name='apartment_detail'),
    path('popular_apartment/', PopularApartmentList.as_view(), name='popular_apartment'),

    path('locations/', LocationListView.as_view(), name='locations_list'),
    path('location/<int:pk>/', LocationDetailView.as_view(), name='location_detail'),

    path('slider_image/', ImagesForClientSlider.as_view(), name='image_for_slider'),


    path('create_review/<int:booking_id>/', ReviewCreateView.as_view(), name='create_review')

]

