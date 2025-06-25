from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Space(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='spaces/')
    work_start = models.TimeField(default="08:00")
    work_end = models.TimeField(default="20:00")

    def __str__(self):
        return self.name


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()  # in minutes
    end_time = models.DateTimeField(editable=False)
    description = models.TextField()

    class Meta:
        ordering = ['start_time']  # Сортировка по умолчанию от ранних к поздним

    def save(self, *args, **kwargs):
        from datetime import timedelta
        self.end_time = self.start_time + timedelta(minutes=self.duration)
        
        # Автоматически очищаем старые бронирования при создании новой брони
        if not self.pk:  # Только при создании новой записи
            self.cleanup_old_bookings()
            
        super().save(*args, **kwargs)

    @classmethod
    def cleanup_old_bookings(cls, days_old=1):
        """
        Автоматически удаляет бронирования, которые уже прошли
        """
        cutoff_time = timezone.now() - timedelta(days=days_old)
        old_bookings = cls.objects.filter(start_time__lt=cutoff_time)
        deleted_count = old_bookings.delete()[0]
        
        if deleted_count > 0:
            print(f"Автоматически удалено {deleted_count} старых бронирований")
        
        return deleted_count

    def __str__(self):
        return f"{self.user.username} - {self.space.name}"
