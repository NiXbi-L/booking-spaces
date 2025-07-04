# Booking Spaces - Система бронирования пространств

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![Django](https://img.shields.io/badge/Django-4.0+-green.svg)](https://djangoproject.com)

Современная веб-система для бронирования пространств (конференц-залов, рабочих мест, спортивных площадок и т.д.).

## 🌟 Особенности

### Для пользователей
- 📅 **Интуитивный календарь** - визуальное отображение доступности пространств
- ⚡ **Быстрое бронирование** - создание брони в несколько кликов
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔔 **Уведомления** - подтверждения и напоминания о бронях
- 📝 **Описания** - добавление заметок к броням
- 🗑️ **Управление бронями** - просмотр, редактирование и удаление

### Для администраторов
- 👥 **Управление пользователями** - просмотр всех броней
- 📊 **Аналитика** - статистика использования пространств
- 🛠️ **Администрирование** - управление пространствами и пользователями
- 🔍 **Детальная информация** - просмотр всех деталей броней

### Технические особенности
- 🔐 **Безопасная аутентификация** - токен-based авторизация
- ⚡ **Высокая производительность** - оптимизированные запросы
- 🧹 **Автоматическая очистка** - удаление устаревших броней
- 📦 **Docker поддержка** - легкое развертывание
- 🔄 **REST API** - полный API для интеграций

## 🔒 Безопасность

### Текущий механизм аутентификации
⚠️ **Важно для продакшена**: Текущий механизм аутентификации (токен-based) реализован для демонстрационных целей и **НЕ РЕКОМЕНДУЕТСЯ** для продакшена без дополнительных мер безопасности.

### Рекомендации для продакшена

#### 1. **Привязка к email с верификацией**
```python
# Рекомендуемая реализация
- Email верификация при регистрации
- Подтверждение email через ссылку
- Восстановление пароля через email
- Двухфакторная аутентификация (2FA)
```

#### 2. **Привязка к номеру телефона**
```python
# Альтернативный вариант
- SMS верификация при регистрации
- Подтверждение через SMS код
- Восстановление через SMS
- Интеграция с SMS сервисами (Twilio, etc.)
```

#### 3. **JWT с единым сервером авторизации**
```python
# Для корпоративного использования
- JWT токены с коротким временем жизни
- Refresh токены для обновления
- Интеграция с LDAP/Active Directory
- OAuth 2.0 / OpenID Connect
- Единая точка входа (SSO)
```

#### 4. **Дополнительные меры безопасности**
- Rate limiting для API
- HTTPS обязателен
- Валидация паролей (сложность, история)
- Логирование попыток входа
- Блокировка после неудачных попыток
- Шифрование чувствительных данных

### Пример интеграции с JWT
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# JWT настройки
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### Пример email верификации
```python
# models.py
class User(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, null=True)
    
# views.py
def register_user(request):
    # Создание пользователя
    # Отправка email с токеном верификации
    # Активация только после подтверждения email
```

## 🖼️ Галерея

Ниже представлены скриншоты интерфейса сайта:

<p align="center">
  <img src="screenshots/browser_vj9rsSEcZG.png" alt="Скриншот 1" width="350"/>
  <img src="screenshots/browser_ep0tJqIM9r.png" alt="Скриншот 2" width="350"/>
  <img src="screenshots/browser_rNQP0KBXTN.png" alt="Скриншот 3" width="350"/>
  <img src="screenshots/browser_GYUjHrFTZq.png" alt="Скриншот 4" width="350"/>
  <img src="screenshots/browser_12nMQBsxvl.png" alt="Скриншот 5" width="350"/>
  <img src="screenshots/browser_rzfLqCPiB0.png" alt="Скриншот 6" width="350"/>
  <img src="screenshots/browser_JnB8Am6ZFv.png" alt="Скриншот 7" width="350"/>
  <img src="screenshots/browser_d2FcaYVJnV.png" alt="Скриншот 8" width="350"/>
  <img src="screenshots/browser_0w0ZRvxDIe.png" alt="Скриншот 9" width="350"/>
  <img src="screenshots/browser_EjFYkrIYWY.png" alt="Скриншот 10" width="350"/>
</p>

## 🏗️ Архитектура

Проект построен на современном стеке технологий:

### Backend (Django)
- **Django 4.0+** - основной веб-фреймворк
- **Django REST Framework** - API
- **PostgreSQL** - база данных
- **Docker** - контейнеризация

### Frontend (React)
- **React 18+** - пользовательский интерфейс
- **TypeScript** - типизация
- **Material-UI** - компоненты интерфейса
- **date-fns** - работа с датами
- **Axios** - HTTP клиент

### Инфраструктура
- **Nginx** - веб-сервер и прокси
- **Docker Compose** - оркестрация контейнеров

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Git

### Установка и запуск

1. **Клонирование репозитория**
```bash
git clone https://github.com/your-username/booking-spaces.git
cd booking-spaces
```

2. **Запуск с Docker**
```bash
docker-compose up -d
```

3. **Открытие в браузере**
```
http://localhost:3000
```

### Ручная установка

Подробные инструкции по установке без Docker см. в папках:
- [Backend README](backend/README.md)
- [Frontend README](frontend/booking_front/README.md)

## 📖 Документация

### API Документация
После запуска сервера API документация доступна по адресу:
```
http://localhost:8000/api/docs/
```

### Основные эндпоинты
- `GET /api/spaces/` - список пространств
- `POST /api/bookings/` - создание брони
- `GET /api/bookings/` - список броней пользователя
- `DELETE /api/bookings/{id}/` - удаление брони

## 🛠️ Разработка

### Структура проекта
```
booking-spaces/
├── backend/                 # Django backend
│   ├── booking_spaceses/    # Основное приложение
│   ├── accounts/           # Управление пользователями
│   └── booking/            # Логика бронирования
├── frontend/               # React frontend
│   └── booking_front/      # React приложение
├── nginx/                  # Nginx конфигурация
└── docker-compose.yml      # Docker оркестрация
```

### Запуск для разработки

1. **Backend**
```bash
cd backend/booking_spaceses
python manage.py runserver
```

2. **Frontend**
```bash
cd frontend/booking_front
npm install
npm start
```

### Тестирование
```bash
# Backend тесты
cd backend/booking_spaceses
python manage.py test

# Frontend тесты
cd frontend/booking_front
npm test
```

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! 

### 🤖 Разработка с помощью ИИ

**Важно**: Frontend часть проекта была разработана с помощью **Cursor** и других нейросетей. Автор специализируется на backend разработке (Django/Python), поэтому **особенно приветствуется помощь опытных frontend разработчиков** для улучшения качества кода, архитектуры и производительности React/TypeScript части.

### 🎯 Приоритетные области для улучшения

#### Frontend (React/TypeScript)
- 🎨 **Архитектура компонентов** - рефакторинг для лучшей переиспользуемости
- ⚡ **Производительность** - оптимизация re-renders, lazy loading
- 📝 **Типизация** - улучшение TypeScript типов и интерфейсов
- 🧪 **Тестирование** - расширение покрытия тестами
- 🎯 **UX/UI** - улучшение пользовательского опыта
- 📚 **Документация** - добавление Storybook, улучшение комментариев
- ♿ **Accessibility** - улучшение доступности (a11y)
- 📱 **PWA** - добавление Progressive Web App функциональности

#### Backend (Django/Python)
- 🔒 **Безопасность** - улучшение механизмов аутентификации
- 📊 **Производительность** - оптимизация запросов, кэширование
- 🧪 **Тестирование** - расширение unit и integration тестов
- 📈 **Мониторинг** - добавление метрик и логирования
- 🔧 **DevOps** - улучшение CI/CD, Docker конфигурации

### Как внести вклад
1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Стандарты кода
- Используйте TypeScript для frontend
- Следуйте PEP 8 для Python
- Добавляйте тесты для новой функциональности
- Обновляйте документацию при необходимости

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🐛 Сообщение об ошибках

Если вы нашли ошибку, пожалуйста, создайте issue с подробным описанием:
- Шаги для воспроизведения
- Ожидаемое поведение
- Фактическое поведение
- Версии используемого ПО

## 🙏 Благодарности

Спасибо всем контрибьюторам, которые помогли сделать этот проект лучше!

---

⭐ Если проект вам понравился, поставьте звездочку на GitHub! 

## 🛤️ Вектор развития

Проект будет активно развиваться и расширяться. Основные направления развития:
- Интеграция с внешними сервисами авторизации (например, Яндекс)
- Улучшение коммуникации с пользователями (email-уведомления)
- Расширение возможностей для внешних владельцев пространств
- Развитие системы ролей и модерации
- Внедрение монетизации и интеграции платежных систем

## 🗺️ Дорожная карта

### 1. Авторизация через Яндекс
- Добавить OAuth авторизацию через Яндекс ID для удобного входа пользователей

### 2. Уведомления на почту
- Реализовать отправку email-уведомлений о бронированиях, подтверждениях, напоминаниях и других событиях

### 3. Возможность подать заявку на добавление своего пространства
- Форма подачи заявки для новых площадок
- Механизм рассмотрения и модерации заявок

#### 3.1 Добавление нового типа аккаунтов "Владелец пространства"
- Владелец может управлять своими площадками
- Доступ к отдельному кабинету владельца

#### 3.2 Владелец может настраивать площадку
- Изменение параметров площадки (описание, фото, расписание, цены и др.)
- Некоторые параметры требуют модерации

#### 3.3 Монетизация и интеграция платежных систем
- Если площадка поддерживает бронирование для внешних пользователей, добавить возможность онлайн-оплаты
- Интеграция с платежными системами (например, ЮKassa, Stripe, PayPal)
- Управление финансовыми операциями для владельцев
