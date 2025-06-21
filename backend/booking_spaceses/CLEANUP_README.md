# Автоматическая очистка старых бронирований

Этот скрипт автоматически удаляет бронирования, которые уже прошли, чтобы поддерживать базу данных в чистоте.

## Файлы

- `cleanup_bookings.py` - основной Python скрипт для очистки
- `run_cleanup.sh` - bash-скрипт для запуска (Linux/Mac)
- `booking/management/commands/cleanup_old_bookings.py` - Django management команда

## Использование

### Ручной запуск

```bash
# Очистить бронирования старше 1 дня (по умолчанию)
python3 cleanup_bookings.py

# Очистить бронирования старше 7 дней
python3 cleanup_bookings.py --days 7

# Предварительный просмотр (не удалять, только показать)
python3 cleanup_bookings.py --dry-run

# Предварительный просмотр для бронирований старше 3 дней
python3 cleanup_bookings.py --days 3 --dry-run
```

### Через bash-скрипт (Linux/Mac)

```bash
# Сделать скрипт исполняемым
chmod +x run_cleanup.sh

# Запустить очистку
./run_cleanup.sh --days 1

# Предварительный просмотр
./run_cleanup.sh --dry-run
```

### Django Management Command

```bash
# Перейти в директорию Django проекта
cd backend/booking_spaceses

# Запустить команду
python manage.py cleanup_old_bookings --days 1

# Предварительный просмотр
python manage.py cleanup_old_bookings --dry-run
```

## Настройка автоматического запуска

### Linux/Mac (cron)

1. Откройте crontab для редактирования:
```bash
crontab -e
```

2. Добавьте строку для ежедневного запуска в 2:00 утра:
```bash
0 2 * * * cd /path/to/your/project/backend/booking_spaceses && python3 cleanup_bookings.py --days 1 >> /var/log/booking_cleanup.log 2>&1
```

3. Или используйте bash-скрипт:
```bash
0 2 * * * /path/to/your/project/backend/booking_spaceses/run_cleanup.sh --days 1 >> /var/log/booking_cleanup.log 2>&1
```

### Windows (Task Scheduler)

1. Откройте "Планировщик задач" (Task Scheduler)
2. Создайте новую задачу
3. Настройте запуск ежедневно в 2:00
4. Команда для запуска:
```
python C:\path\to\your\project\backend\booking_spaceses\cleanup_bookings.py --days 1
```

### Docker (если используете Docker)

Добавьте в `docker-compose.yml`:

```yaml
services:
  cleanup:
    build: ./backend/booking_spaceses
    command: python cleanup_bookings.py --days 1
    environment:
      - POSTGRES_HOST=django
      - POSTGRES_DB=booking_spaces
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    depends_on:
      - django
    restart: "no"
```

И запускайте через cron:
```bash
0 2 * * * docker-compose run --rm cleanup
```

## Переменные окружения

Скрипт использует следующие переменные окружения (или значения по умолчанию):

- `POSTGRES_HOST` - хост базы данных (по умолчанию: host.docker.internal)
- `POSTGRES_PORT` - порт базы данных (по умолчанию: 5432)
- `POSTGRES_DB` - имя базы данных (по умолчанию: booking_spaces)
- `POSTGRES_USER` - пользователь базы данных (по умолчанию: postgres)
- `POSTGRES_PASSWORD` - пароль базы данных (по умолчанию: postgres)

## Логирование

Рекомендуется настроить логирование для отслеживания работы скрипта:

```bash
# Добавить в cron с логированием
0 2 * * * /path/to/cleanup_bookings.py --days 1 >> /var/log/booking_cleanup.log 2>&1
```

## Безопасность

- Скрипт удаляет только записи, которые уже прошли
- Используйте `--dry-run` для предварительного просмотра
- Рекомендуется сначала протестировать на тестовой базе данных
- Убедитесь, что у пользователя базы данных есть права на удаление записей

## Мониторинг

Проверяйте логи регулярно:
```bash
tail -f /var/log/booking_cleanup.log
``` 