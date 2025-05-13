from django.urls import path
from .views import SpaceListView, BookingCreateView, BookingDeleteView, SpaceBookingsView, UserBookingsListView

urlpatterns = [
    path('spaces/', SpaceListView.as_view(), name='space-list'),
    path('spaces/<int:space_id>/bookings/', SpaceBookingsView.as_view(), name='space-bookings'),
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<int:pk>/', BookingDeleteView.as_view(), name='booking-delete'),
    path('bookings/my/', UserBookingsListView.as_view(), name='my-bookings'),
]
