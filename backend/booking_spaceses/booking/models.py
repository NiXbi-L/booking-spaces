from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Space(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='spaces/')

    def __str__(self):
        return self.name


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    space = models.ForeignKey(Space, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()  # in minutes
    end_time = models.DateTimeField(editable=False)
    description = models.TextField()

    def save(self, *args, **kwargs):
        from datetime import timedelta
        self.end_time = self.start_time + timedelta(minutes=self.duration)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.space.name}"
