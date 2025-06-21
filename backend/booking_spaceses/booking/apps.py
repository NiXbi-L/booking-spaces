from django.apps import AppConfig


class BookingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'booking'

    def ready(self):
        """
        Вызывается при запуске приложения Django
        Автоматически очищаем старые бронирования при старте
        """
        try:
            from .models import Booking
            # Очищаем старые бронирования при запуске приложения
            deleted_count = Booking.cleanup_old_bookings()
            if deleted_count > 0:
                print(f"При запуске приложения удалено {deleted_count} старых бронирований")
            
            # Импортируем сигналы для их регистрации
            from . import signals
        except Exception as e:
            # Игнорируем ошибки при миграциях
            pass
