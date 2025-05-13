# Документация API

## Аутентификация

### Регистрация нового пользователя
**URL:** `/api/auth/register/`  
**Метод:** `POST`  
**Тело запроса:**
```json
{
    "username": "string",
    "password": "string"
}
```
**Ответ (успех):**
```json
{
    "username": "string"
}
```

### Вход пользователя
**URL:** `/api/auth/login/`  
**Метод:** `POST`  
**Тело запроса:**
```json
{
    "username": "string",
    "password": "string"
}
```
**Ответ (успех):**
```json
{
    "token": "string"
}
```

---

## Пространства (Spaces)

### Получить список всех пространств
**URL:** `/api/spaces/`  
**Метод:** `GET`  
**Ответ:**
```json
[
    {
        "id": "int",
        "name": "string",
        "description": "string",
        "image": "base64-encoded-string"
    }
]
```

---

## Бронирования (Bookings)

### Создать бронирование
**URL:** `/api/bookings/`  
**Метод:** `POST`  
**Требует аутентификации:** Да (токен в заголовке `Authorization`)  
**Тело запроса:**
```json
{
    "space": "int (ID пространства)",
    "start_time": "datetime (формат: 2023-10-25T14:30:00Z)",
    "duration": "int (в минутах)",
    "description": "string"
}
```
**Ответ (успех):**
```json
{
    "id": "int",
    "space": "int",
    "start_time": "datetime",
    "duration": "int",
    "description": "string"
}
```
**Ошибки:**
- `400 Bad Request`: Некорректные данные (например, время в прошлом, конфликт бронирования).
- `401 Unauthorized`: Токен отсутствует или недействителен.

### Удалить бронирование
**URL:** `/api/bookings/<int:pk>/`  
**Метод:** `DELETE`  
**Требует аутентификации:** Да (только владелец бронирования)  
**Ответ (успех):**
```json
{
    "detail": "Booking deleted successfully"
}
```
**Ошибки:**
- `403 Forbidden`: Пользователь не является владельцем бронирования.
- `404 Not Found`: Бронирование не существует.

### Получить бронирования для пространства на конкретную дату
**URL:** `/api/spaces/<int:space_id>/bookings/?date=YYYY-MM-DD`  
**Метод:** `GET`  
**Параметры:**
- `date` (обязательный): Дата в формате `YYYY-MM-DD`.

**Ответ:**
```json
[
    {
        "id": "int",
        "user": "int (ID пользователя)",
        "space": "int",
        "start_time": "datetime",
        "duration": "int",
        "end_time": "datetime",
        "description": "string"
    }
]
```
**Ошибки:**
- `400 Bad Request`: Некорректный формат даты.

---

## Особенности
1. **Конфликты времени:** Бронирование невозможно, если выбранный слот пересекается с существующим.
2. **Изображения:** Изображения пространств возвращаются в формате `base64`.
3. **Автоматическое время окончания:** Поле `end_time` рассчитывается как `start_time + duration` (в минутах).

## Примеры заголовков
Для аутентифицированных запросов:
```http
Authorization: Token <ваш_токен>
```