# Booking Spaces Backend

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.0+-green.svg)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/Django%20REST%20Framework-3.14+-red.svg)](https://www.django-rest-framework.org/)

Backend API для системы бронирования пространств, построенный на Django и Django REST Framework.

## 🏗️ Архитектура

### Приложения Django
- **booking_spaceses** - основное приложение с настройками проекта
- **accounts** - управление пользователями и аутентификация
- **booking** - логика бронирования пространств

### Основные модели
- **User** - пользователи системы
- **Space** - пространства для бронирования
- **Booking** - бронирования

## 🚀 Быстрый старт

### Предварительные требования
- Python 3.8+
- pip
- PostgreSQL (для продакшена) или SQLite (для разработки)

### Установка

1. **Клонирование и переход в директорию**
```bash
cd backend/booking_spaceses
```

2. **Создание виртуального окружения**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows
```

3. **Установка зависимостей**
```bash
pip install -r requirements.txt
```

4. **Настройка базы данных**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Создание суперпользователя**
```bash
python manage.py createsuperuser
```

6. **Запуск сервера разработки**
```bash
python manage.py runserver
```

Сервер будет доступен по адресу: http://localhost:8000

## 📖 API Документация

### Аутентификация
API использует токен-аутентификацию. Получите токен через эндпоинт:
```
POST /api/auth/login/
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

### Основные эндпоинты

#### Пространства (Spaces)
```
GET /api/spaces/                    # Список всех пространств
GET /api/spaces/{id}/              # Детали пространства
GET /api/spaces/{id}/bookings/     # Брони пространства по дате
```

#### Бронирования (Bookings)
```
GET /api/bookings/                 # Брони текущего пользователя
POST /api/bookings/                # Создание новой брони
GET /api/bookings/{id}/            # Детали брони
DELETE /api/bookings/{id}/         # Удаление брони
```

#### Пользователи (Users)
```
GET /api/auth/me/                  # Информация о текущем пользователе
POST /api/auth/register/           # Регистрация нового пользователя
```

### Примеры запросов

#### Создание брони
```bash
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Authorization: Token your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "space": 1,
    "start_time": "2024-01-15T10:00:00Z",
    "duration": 120,
    "description": "Встреча команды"
  }'
```

#### Получение броней пространства
```bash
curl -X GET "http://localhost:8000/api/spaces/1/bookings/?date=2024-01-15" \
  -H "Authorization: Token your_token_here"
```

## 🛠️ Разработка

### Структура проекта
```
booking_spaceses/
├── accounts/              # Управление пользователями
│   ├── models.py         # Модель User
│   ├── serializers.py    # Сериализаторы
│   ├── views.py          # API views
│   └── urls.py           # URL маршруты
├── booking/              # Логика бронирования
│   ├── models.py         # Модели Space и Booking
│   ├── serializers.py    # Сериализаторы
│   ├── views.py          # API views
│   ├── permissions.py    # Права доступа
│   └── signals.py        # Django signals
├── booking_spaceses/     # Основное приложение
│   ├── settings.py       # Настройки Django
│   ├── urls.py           # Основные URL маршруты
│   └── wsgi.py           # WSGI конфигурация
└── manage.py             # Django management
```

### Переменные окружения
Создайте файл `.env` в корне проекта:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/booking_spaces
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Команды управления

#### Миграции
```bash
python manage.py makemigrations    # Создание миграций
python manage.py migrate           # Применение миграций
python manage.py showmigrations    # Просмотр миграций
```

#### Суперпользователь
```bash
python manage.py createsuperuser  # Создание админа
python manage.py changepassword   # Изменение пароля
```

#### Очистка данных
```bash
python manage.py cleanup_old_bookings  # Удаление старых броней
```

### Тестирование
```bash
# Запуск всех тестов
python manage.py test

# Тесты конкретного приложения
python manage.py test booking
python manage.py test accounts

# Тесты с покрытием
coverage run --source='.' manage.py test
coverage report
```

## 🔧 Настройка

### База данных
По умолчанию используется SQLite. Для продакшена рекомендуется PostgreSQL:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'booking_spaces',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS настройки
Для работы с frontend на другом порту:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Логирование
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

## 🚀 Развертывание

### Docker
```bash
docker build -t booking-spaces-backend .
docker run -p 8000:8000 booking-spaces-backend
```

### Gunicorn (продакшен)
```bash
pip install gunicorn
gunicorn booking_spaceses.wsgi:application --bind 0.0.0.0:8000
```

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Безопасность

### Права доступа
- Пользователи могут создавать/удалять только свои брони
- Администраторы могут просматривать все брони
- Суперпользователи имеют полный доступ

### Валидация
- Проверка доступности времени
- Ограничение на количество активных броней (2 на пользователя на пространство)
- Автоматическая очистка устаревших броней

## 📊 Мониторинг

### Health Check
```
GET /api/health/
```

### Статистика
```
GET /api/stats/bookings/     # Статистика бронирований
GET /api/stats/spaces/       # Статистика пространств
```

## 🐛 Отладка

### Django Debug Toolbar
```bash
pip install django-debug-toolbar
```

Добавьте в `settings.py`:
```python
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']
```

### Логирование SQL запросов
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## 📝 Лицензия

Этот проект лицензирован под MIT License.

## 🤝 Вклад в проект

См. основной [README](../README.md) для информации о том, как внести вклад в проект.