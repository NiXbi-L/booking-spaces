from rest_framework import generics, permissions
from .models import Space, Booking
from .serializers import SpaceSerializer, BookingSerializer
from rest_framework.exceptions import ValidationError
from datetime import datetime
from .permissions import IsOwner
from rest_framework.response import Response


class SpaceListView(generics.ListAPIView):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer
    permission_classes = [permissions.AllowAny]


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]


class BookingDeleteView(generics.DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({"detail": "Booking deleted successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class SpaceBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        space_id = self.kwargs['space_id']
        date_str = self.request.query_params.get('date')

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            raise ValidationError("Invalid date format. Use YYYY-MM-DD.")

        start = datetime.combine(date, datetime.min.time())
        end = datetime.combine(date, datetime.max.time())

        return Booking.objects.filter(
            space_id=space_id,
            start_time__gte=start,
            start_time__lte=end
        )


class UserBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Возвращает только бронирования текущего пользователя
        return Booking.objects.filter(user=self.request.user)
