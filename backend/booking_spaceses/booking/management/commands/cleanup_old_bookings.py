from django.core.management.base import BaseCommand
from django.utils import timezone
from booking.models import Booking
from datetime import timedelta


class Command(BaseCommand):
    help = 'Удаляет все бронирования, которые уже завершились'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=1,
            help='Удалять бронирования старше указанного количества дней (по умолчанию 1)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Показать, какие бронирования будут удалены, но не удалять их'
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        
        # Вычисляем время, после которого бронирования считаются старыми
        cutoff_time = timezone.now() - timedelta(days=days)
        
        # Находим все бронирования, которые уже завершились
        old_bookings = Booking.objects.filter(
            start_time__lt=cutoff_time
        )
        
        count = old_bookings.count()
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('Нет старых бронирований для удаления')
            )
            return
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f'Будет удалено {count} бронирований старше {days} дней:'
                )
            )
            for booking in old_bookings[:10]:  # Показываем первые 10
                self.stdout.write(
                    f'  - ID {booking.id}: {booking.space.name} на {booking.start_time}'
                )
            if count > 10:
                self.stdout.write(f'  ... и еще {count - 10} бронирований')
        else:
            # Удаляем старые бронирования
            deleted_count = old_bookings.delete()[0]
            self.stdout.write(
                self.style.SUCCESS(
                    f'Удалено {deleted_count} старых бронирований'
                )
            ) 