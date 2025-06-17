# Базовый образ Python
FROM python:3.9-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копирование и установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование проекта
COPY .. .

# Сборка статических файлов
RUN python manage.py collectstatic --noinput

# Команда запуска
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "booking_spaceses.wsgi"]