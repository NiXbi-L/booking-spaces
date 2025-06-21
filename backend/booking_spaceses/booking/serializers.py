from rest_framework import serializers
from .models import Space, Booking
import base64
from django.core.files.base import ContentFile


class SpaceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)  # Теперь возвращает URL

    class Meta:
        model = Space
        fields = ['id', 'name', 'description', 'image', 'work_start', 'work_end']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'space', 'start_time', 'duration', 'description']
        read_only_fields = ['user']

    def validate(self, data):
        from django.utils import timezone
        from datetime import timedelta, time

        if data['start_time'] < timezone.now():
            raise serializers.ValidationError("Booking cannot be in the past.")

        space = data['space']
        start_time = data['start_time']
        duration = data['duration']
        end_time = start_time + timedelta(minutes=duration)

        # Проверка на пересечение слотов с разрывом 15 минут
        min_gap = timedelta(minutes=15)
        overlapping = Booking.objects.filter(
            space=space,
            start_time__lt=end_time + min_gap,
            end_time__gt=start_time - min_gap
        )
        if self.instance:
            overlapping = overlapping.exclude(id=self.instance.id)
        if overlapping.exists():
            raise serializers.ValidationError("Time slot is already booked or too close to another booking (min 15 min gap required).")

        # Проверка на рабочие часы
        work_start = space.work_start
        work_end = space.work_end
        if not (work_start <= start_time.time() < work_end and work_start < end_time.time() <= work_end):
            raise serializers.ValidationError(f"Booking must be within working hours: {work_start} - {work_end}.")

        # Проверка на максимальное количество броней пользователя
        user = self.context['request'].user
        active_bookings = Booking.objects.filter(
            user=user,
            space=space,  # Только для этого пространства
            start_time__gt=timezone.now()  # Только будущие брони
        ).count()
        if not self.instance and active_bookings >= 2:
            raise serializers.ValidationError("You cannot have more than 2 active bookings for this space.")

        # Проверка на максимальную длительность слота
        if duration > 120:
            raise serializers.ValidationError("Booking duration cannot exceed 2 hours (120 minutes).")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
