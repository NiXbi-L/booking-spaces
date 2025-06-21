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

### ⚠️ ВАЖНО: Текущий механизм аутентификации

**Текущая реализация предназначена только для демонстрации и разработки!**

Система использует простую токен-аутентификацию Django REST Framework, которая **НЕ ПОДХОДИТ** для продакшена без серьезных доработок.

### 🔐 Рекомендации для продакшена

#### 1. **Email верификация (Рекомендуется)**

```python
# requirements.txt
django-allauth==0.54.0
django-email-verification==0.3.2

# settings.py
INSTALLED_APPS += [
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Настройки email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'

# Настройки allauth
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED = False
```

#### 2. **SMS верификация**

```python
# requirements.txt
twilio==7.17.0

# settings.py
TWILIO_ACCOUNT_SID = 'your-account-sid'
TWILIO_AUTH_TOKEN = 'your-auth-token'
TWILIO_PHONE_NUMBER = '+1234567890'

# models.py
class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    phone_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, null=True)
    verification_code_expires = models.DateTimeField(null=True)
```

#### 3. **JWT аутентификация (Корпоративное решение)**

```python
# requirements.txt
djangorestframework-simplejwt==5.2.2

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
```

#### 4. **OAuth 2.0 / OpenID Connect**

```python
# requirements.txt
django-allauth==0.54.0
requests-oauthlib==1.3.1

# settings.py
INSTALLED_APPS += [
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.microsoft',
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    },
    'microsoft': {
        'TENANT': 'common',
        'SCOPE': ['User.Read'],
    }
}
```

#### 5. **LDAP / Active Directory интеграция**

```python
# requirements.txt
django-auth-ldap==4.5.0

# settings.py
import ldap
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType

AUTH_LDAP_SERVER_URI = "ldap://ldap.example.com"
AUTH_LDAP_BIND_DN = "cn=admin,dc=example,dc=com"
AUTH_LDAP_BIND_PASSWORD = "password"
AUTH_LDAP_USER_SEARCH = LDAPSearch(
    "ou=users,dc=example,dc=com",
    ldap.SCOPE_SUBTREE,
    "(sAMAccountName=%(user)s)"
)

AUTHENTICATION_BACKENDS = [
    'django_auth_ldap.backend.LDAPBackend',
    'django.contrib.auth.backends.ModelBackend',
]
```

### 🛡️ Дополнительные меры безопасности

#### Rate Limiting
```python
# requirements.txt
django-ratelimit==4.1.0

# views.py
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='5/m', method='POST')
def login_view(request):
    # Логика входа
    pass

@ratelimit(key='user', rate='10/m', method='POST')
def create_booking(request):
    # Создание брони
    pass
```

#### Валидация паролей
```python
# settings.py
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

#### HTTPS и безопасные заголовки
```python
# settings.py
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
```

#### Логирование безопасности
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'security_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'security.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django.security': {
            'handlers': ['security_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### 🔍 Мониторинг безопасности

#### Проверка подозрительной активности
```python
# middleware.py
class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Логирование попыток входа
        if request.path == '/api/auth/login/' and request.method == 'POST':
            self.log_login_attempt(request)
        
        response = self.get_response(request)
        return response

    def log_login_attempt(self, request):
        ip = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Проверка на подозрительную активность
        if self.is_suspicious_activity(ip):
            logger.warning(f"Suspicious login attempt from IP: {ip}")
```

### 📋 Чек-лист безопасности для продакшена

- [ ] Заменить токен-аутентификацию на JWT или OAuth
- [ ] Добавить email/SMS верификацию
- [ ] Настроить HTTPS
- [ ] Добавить rate limiting
- [ ] Настроить валидацию паролей
- [ ] Добавить логирование безопасности
- [ ] Настроить мониторинг подозрительной активности
- [ ] Регулярно обновлять зависимости
- [ ] Настроить резервное копирование
- [ ] Провести аудит безопасности

### Права доступа
- Пользователи могут создавать/удалять только свои брони
- Администраторы могут просматривать все брони
- Суперпользователи имеют полный доступ

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