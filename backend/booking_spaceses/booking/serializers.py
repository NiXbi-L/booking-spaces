from rest_framework import serializers
from .models import Space, Booking
import base64
from django.core.files.base import ContentFile


class SpaceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)  # Теперь возвращает URL

    class Meta:
        model = Space
        fields = ['id', 'name', 'description', 'image']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'space', 'start_time', 'duration', 'description']
        read_only_fields = ['user']

    def validate(self, data):
        from django.utils import timezone
        from datetime import timedelta

        if data['start_time'] < timezone.now():
            raise serializers.ValidationError("Booking cannot be in the past.")

        space = data['space']
        start_time = data['start_time']
        duration = data['duration']
        end_time = start_time + timedelta(minutes=duration)

        overlapping = Booking.objects.filter(
            space=space,
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        if self.instance:
            overlapping = overlapping.exclude(id=self.instance.id)

        if overlapping.exists():
            raise serializers.ValidationError("Time slot is already booked.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
