from django.contrib import admin
from .models import Space, Booking


@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'space', 'start_time', 'duration']
    list_filter = ['space', 'start_time']
    search_fields = ['user__username', 'description']
