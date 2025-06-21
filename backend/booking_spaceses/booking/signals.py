from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import Booking


@receiver(post_save, sender=Booking)
def cleanup_old_bookings_on_save(sender, instance, created, **kwargs):
    """
    Автоматически очищает старые бронирования после сохранения новой брони
    """
    if created:  # Только при создании новой записи
        # Очищаем бронирования старше 1 дня
        cutoff_time = timezone.now() - timedelta(days=1)
        old_bookings = Booking.objects.filter(start_time__lt=cutoff_time)
        deleted_count = old_bookings.delete()[0]
        
        if deleted_count > 0:
            print(f"После создания новой брони удалено {deleted_count} старых бронирований")


def periodic_cleanup():
    """
    Функция для периодической очистки (можно вызывать из внешнего планировщика)
    """
    cutoff_time = timezone.now() - timedelta(days=1)
    old_bookings = Booking.objects.filter(start_time__lt=cutoff_time)
    deleted_count = old_bookings.delete()[0]
    
    if deleted_count > 0:
        print(f"Периодическая очистка: удалено {deleted_count} старых бронирований")
    
    return deleted_count 