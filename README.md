# Booking Spaces - Система бронирования пространств

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![Django](https://img.shields.io/badge/Django-4.0+-green.svg)](https://djangoproject.com)

Современная веб-система для бронирования пространств (конференц-залов, рабочих мест, спортивных площадок и т.д.) с интуитивным интерфейсом и мощным бэкендом.

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