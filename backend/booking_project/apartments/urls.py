from django.urls import path
from . import views


urlpatterns = [
    path('apartment/', views.ApartmentCreateListView.as_view(), name='apartment'),
    path('apartment/user', views.UserApartmentList.as_view(), name='apartment'),


    path('apartment_update/<int:pk>/', views.ApartmentUpdateView.as_view(), name='apartment_update'),
    path('apartment_detail/<int:pk>/', views.ApartmentDetailView.as_view(), name='apartment_detail'),
    path('apartment_delete/<int:pk>/', views.ApartmentDeleteView.as_view(), name='apartment_delete'),

    path('locations/', views.LocationListView.as_view(), name='locations_list'),
    path('location/<int:pk>/', views.LocationDetailView.as_view(), name='location_detail'),

    path('apartments/<int:apartment_id>/reviews/', views.ApartmentReviewView.as_view(), name='apartment_reviews'),


    path('slider_image/', views.ImagesForClientSlider.as_view(), name='image_for_slider'),
    path('popular_apartment/', views.PopularApartmentList.as_view(), name='popular_apartment'),


    path('create_review/<int:apartment_id>/', views.ReviewCreateView.as_view(), name='create_review'),

]

