#!/usr/bin/env python3
"""
Скрипт для очистки старых бронирований
Запускать: python cleanup_bookings.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

# Настройки базы данных (из переменных окружения или по умолчанию)
DB_CONFIG = {
    'host': os.getenv('POSTGRES_HOST', 'host.docker.internal'),
    'port': os.getenv('POSTGRES_PORT', '5432'),
    'database': os.getenv('POSTGRES_DB', 'booking_spaces'),
    'user': os.getenv('POSTGRES_USER', 'postgres'),
    'password': os.getenv('POSTGRES_PASSWORD', 'postgres'),
}

def cleanup_old_bookings(days_old=1):
    """
    Удаляет бронирования старше указанного количества дней
    """
    try:
        # Подключаемся к базе данных
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Вычисляем время отсечения
        cutoff_time = datetime.now() - timedelta(days=days_old)
        
        # Сначала посчитаем, сколько записей будет удалено
        cursor.execute("""
            SELECT COUNT(*) as count 
            FROM booking_booking 
            WHERE start_time < %s
        """, (cutoff_time,))
        
        count_result = cursor.fetchone()
        count = count_result['count'] if count_result else 0
        
        if count == 0:
            print(f"Нет старых бронирований для удаления (старше {days_old} дней)")
            return
        
        print(f"Найдено {count} старых бронирований для удаления")
        
        # Показываем примеры записей, которые будут удалены
        cursor.execute("""
            SELECT id, start_time, description 
            FROM booking_booking 
            WHERE start_time < %s 
            ORDER BY start_time DESC 
            LIMIT 5
        """, (cutoff_time,))
        
        examples = cursor.fetchall()
        print("Примеры записей для удаления:")
        for example in examples:
            print(f"  - ID {example['id']}: {example['start_time']} - {example['description']}")
        
        # Удаляем старые записи
        cursor.execute("""
            DELETE FROM booking_booking 
            WHERE start_time < %s
        """, (cutoff_time,))
        
        deleted_count = cursor.rowcount
        conn.commit()
        
        print(f"Успешно удалено {deleted_count} старых бронирований")
        
    except Exception as e:
        print(f"Ошибка при очистке: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def main():
    """Основная функция"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Очистка старых бронирований')
    parser.add_argument(
        '--days', 
        type=int, 
        default=1, 
        help='Удалять бронирования старше указанного количества дней (по умолчанию 1)'
    )
    parser.add_argument(
        '--dry-run', 
        action='store_true', 
        help='Показать, какие записи будут удалены, но не удалять их'
    )
    
    args = parser.parse_args()
    
    if args.dry_run:
        print("Режим предварительного просмотра (dry-run)")
        # В режиме dry-run просто показываем информацию
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cutoff_time = datetime.now() - timedelta(days=args.days)
            
            cursor.execute("""
                SELECT COUNT(*) as count 
                FROM booking_booking 
                WHERE start_time < %s
            """, (cutoff_time,))
            
            count_result = cursor.fetchone()
            count = count_result['count'] if count_result else 0
            
            if count == 0:
                print(f"Нет старых бронирований для удаления (старше {args.days} дней)")
            else:
                print(f"Будет удалено {count} бронирований старше {args.days} дней")
                
                cursor.execute("""
                    SELECT id, start_time, description 
                    FROM booking_booking 
                    WHERE start_time < %s 
                    ORDER BY start_time DESC 
                    LIMIT 10
                """, (cutoff_time,))
                
                examples = cursor.fetchall()
                print("Примеры записей для удаления:")
                for example in examples:
                    print(f"  - ID {example['id']}: {example['start_time']} - {example['description']}")
                    
        except Exception as e:
            print(f"Ошибка при предварительном просмотре: {e}")
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'conn' in locals():
                conn.close()
    else:
        cleanup_old_bookings(args.days)

if __name__ == "__main__":
    main() 