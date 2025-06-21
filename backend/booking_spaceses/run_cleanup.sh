#!/bin/bash

# Скрипт для запуска очистки старых бронирований
# Использование: ./run_cleanup.sh [--days N] [--dry-run]

# Переходим в директорию скрипта
cd "$(dirname "$0")"

# Проверяем, установлен ли Python
if ! command -v python3 &> /dev/null; then
    echo "Ошибка: Python3 не найден"
    exit 1
fi

# Проверяем, установлен ли psycopg2
python3 -c "import psycopg2" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Устанавливаем psycopg2..."
    pip3 install psycopg2-binary
fi

# Запускаем скрипт очистки с переданными аргументами
python3 cleanup_bookings.py "$@" 