# Booking Spaces Frontend

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0+-green.svg)](https://mui.com)

Современный React frontend для системы бронирования пространств с интуитивным интерфейсом и адаптивным дизайном.

## 🌟 Особенности

### Пользовательский интерфейс
- 📅 **Интерактивный календарь** - визуальное отображение доступности
- 🎨 **Material-UI дизайн** - современный и красивый интерфейс
- 📱 **Адаптивность** - работает на всех устройствах
- ⚡ **Быстрая навигация** - интуитивные переходы между страницами
- 🔔 **Уведомления** - подтверждения действий и ошибки

### Функциональность
- 🔐 **Аутентификация** - регистрация и вход пользователей
- 📋 **Управление бронями** - создание, просмотр, удаление
- 👥 **Админ-панель** - специальные возможности для администраторов
- 🕒 **Временные слоты** - удобный выбор времени и продолжительности
- 📝 **Описания** - добавление заметок к броням

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 16+
- npm или yarn
- Backend API (см. [backend README](../../backend/README.md))

### Установка

1. **Переход в директорию**
```bash
cd frontend/booking_front
```

2. **Установка зависимостей**
```bash
npm install
# или
yarn install
```

3. **Настройка переменных окружения**
Создайте файл `.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

4. **Запуск в режиме разработки**
```bash
npm start
# или
yarn start
```

Приложение будет доступно по адресу: http://localhost:3000

## 🏗️ Архитектура

### Структура проекта
```
src/
├── components/           # React компоненты
│   ├── Auth.tsx         # Компонент аутентификации
│   ├── BookingDialog.tsx # Диалог создания брони
│   ├── Calendar.tsx     # Календарь и управление бронями
│   ├── SpaceDetail.tsx  # Детали пространства
│   └── Spaces.tsx       # Список пространств
├── contexts/            # React контексты
│   └── AuthContext.tsx  # Контекст аутентификации
├── services/            # API сервисы
│   └── api.ts          # HTTP клиент и API методы
├── types/               # TypeScript типы
│   └── index.ts        # Определения типов
├── App.tsx              # Главный компонент
├── config.ts            # Конфигурация
└── index.tsx            # Точка входа
```

### Основные компоненты

#### Auth.tsx
Компонент для регистрации и входа пользователей с валидацией форм.

#### Calendar.tsx
Основной компонент для просмотра и управления бронями:
- Календарь с визуализацией занятости
- Создание новых броней
- Удаление существующих броней
- Админ-панель для просмотра всех броней

#### SpaceDetail.tsx
Детальная информация о пространстве:
- Просмотр броней на конкретную дату
- Создание брони для выбранного пространства
- Админ-функции для управления бронями

#### BookingDialog.tsx
Диалог для создания новой брони с выбором времени и продолжительности.

## 🛠️ Разработка

### Команды

```bash
# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Проверка типов TypeScript
npm run type-check

# Линтинг кода
npm run lint

# Исправление ошибок линтера
npm run lint:fix
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `REACT_APP_API_BASE_URL` | URL backend API | `http://localhost:8000` |
| `REACT_APP_ENVIRONMENT` | Окружение (development/production) | `development` |

### Структура компонентов

#### Типизация
```typescript
interface Space {
  id: number;
  name: string;
  description: string;
  image: string;
  work_start?: string;
  work_end?: string;
}

interface Booking {
  id: number;
  space: number;
  start_time: string;
  duration: number;
  description: string;
  user?: number;
}
```

#### API сервисы
```typescript
// services/api.ts
export const api = {
  // Аутентификация
  login: (credentials: LoginCredentials) => Promise<AuthResponse>,
  register: (userData: RegisterData) => Promise<AuthResponse>,
  
  // Пространства
  getSpaces: () => Promise<Space[]>,
  getSpaceBookings: (spaceId: number, date: string) => Promise<Booking[]>,
  
  // Бронирования
  getBookings: () => Promise<Booking[]>,
  createBooking: (bookingData: CreateBookingData) => Promise<Booking>,
  deleteBooking: (bookingId: number) => Promise<void>,
};
```

## 🎨 UI/UX Особенности

### Material-UI компоненты
- **Dialog** - модальные окна для форм
- **Calendar** - календарь с визуализацией
- **Button** - кнопки с различными стилями
- **TextField** - поля ввода с валидацией
- **Typography** - типографика
- **Grid** - адаптивная сетка

### Адаптивный дизайн
- Мобильная версия с оптимизированным интерфейсом
- Планшетная версия с улучшенной навигацией
- Десктопная версия с полным функционалом

### Темы и стили
```typescript
// Настройка темы Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 🔧 Конфигурация

### Настройка API
```typescript
// config.ts
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    ME: '/api/auth/me/',
  },
  SPACES: {
    LIST: '/api/spaces/',
    DETAIL: (id: number) => `/api/spaces/${id}/`,
    BOOKINGS: (id: number) => `/api/spaces/${id}/bookings/`,
  },
  BOOKINGS: {
    LIST: '/api/bookings/',
    CREATE: '/api/bookings/',
    DELETE: (id: number) => `/api/bookings/${id}/`,
  },
};
```

### Обработка ошибок
```typescript
// Централизованная обработка ошибок API
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Перенаправление на страницу входа
      window.location.href = '/login';
    }
    return error.response?.data?.message || 'Произошла ошибка';
  }
  return 'Неизвестная ошибка';
};
```

## 🧪 Тестирование

### Unit тесты
```bash
# Запуск всех тестов
npm test

# Запуск тестов в watch режиме
npm test -- --watch

# Запуск тестов с покрытием
npm test -- --coverage
```

### Пример теста компонента
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Auth } from './Auth';

test('renders login form', () => {
  render(<Auth />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## 🚀 Развертывание

### Сборка для продакшена
```bash
npm run build
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/booking-frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Безопасность

### ⚠️ ВАЖНО: Текущий механизм аутентификации

**Текущая реализация предназначена только для демонстрации и разработки!**

Frontend использует простую токен-аутентификацию, которая **НЕ ПОДХОДИТ** для продакшена без дополнительных мер безопасности.

### 🔐 Рекомендации для продакшена

#### 1. **JWT токены с автоматическим обновлением**

```typescript
// services/auth.ts
interface AuthTokens {
  access: string;
  refresh: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await api.post('/api/token/', credentials);
    this.setTokens(response.data);
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error('No refresh token');
    
    const response = await api.post('/api/token/refresh/', {
      refresh: this.refreshToken
    });
    this.accessToken = response.data.access;
  }

  private setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    localStorage.setItem('refreshToken', tokens.refresh);
  }
}
```

#### 2. **Интерцептор для автоматического обновления токенов**

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshAccessToken();
        const newToken = localStorage.getItem('accessToken');
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Перенаправление на страницу входа
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 3. **Защищенные маршруты**

```typescript
// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

#### 4. **Валидация форм на клиенте**

```typescript
// utils/validation.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Имя пользователя обязательно')
    .min(3, 'Минимум 3 символа'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Минимум 8 символов')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Пароль должен содержать буквы и цифры'
    ),
});

export const bookingSchema = yup.object({
  start_time: yup
    .date()
    .required('Время начала обязательно')
    .min(new Date(), 'Нельзя бронировать в прошлом'),
  duration: yup
    .number()
    .required('Продолжительность обязательна')
    .min(30, 'Минимум 30 минут')
    .max(480, 'Максимум 8 часов'),
  description: yup
    .string()
    .max(500, 'Максимум 500 символов'),
});
```

#### 5. **Безопасное хранение токенов**

```typescript
// utils/storage.ts
class SecureStorage {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static setAccessToken(token: string): void {
    // В продакшене используйте httpOnly cookies вместо localStorage
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static removeTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

### 🛡️ Дополнительные меры безопасности

#### CSP (Content Security Policy)
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;">
```

#### Защита от XSS
```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};
```

#### Rate Limiting на клиенте
```typescript
// utils/rateLimit.ts
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Удаляем старые попытки
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}
```

### 🔍 Мониторинг безопасности

#### Логирование событий безопасности
```typescript
// utils/securityLogger.ts
class SecurityLogger {
  static logLoginAttempt(username: string, success: boolean, ip?: string): void {
    const event = {
      type: 'login_attempt',
      username,
      success,
      ip,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    // Отправка в систему мониторинга
    this.sendToMonitoring(event);
  }

  static logSuspiciousActivity(activity: string, details: any): void {
    const event = {
      type: 'suspicious_activity',
      activity,
      details,
      timestamp: new Date().toISOString(),
    };
    
    console.warn('Suspicious activity detected:', event);
    this.sendToMonitoring(event);
  }

  private static sendToMonitoring(event: any): void {
    // Интеграция с системами мониторинга (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Отправка в систему мониторинга
    }
  }
}
```

### 📋 Чек-лист безопасности для продакшена

- [ ] Заменить токен-аутентификацию на JWT
- [ ] Добавить автоматическое обновление токенов
- [ ] Реализовать защищенные маршруты
- [ ] Добавить валидацию форм
- [ ] Настроить CSP заголовки
- [ ] Добавить защиту от XSS
- [ ] Реализовать rate limiting на клиенте
- [ ] Настроить логирование безопасности
- [ ] Использовать HTTPS
- [ ] Регулярно обновлять зависимости

### Аутентификация

## 📊 Производительность

### Оптимизации
- Code splitting для компонентов
- Lazy loading для изображений
- Мемоизация компонентов
- Оптимизация бандла

### Мониторинг
```typescript
// Отслеживание производительности
const measurePerformance = (componentName: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
  };
};
```

## 🐛 Отладка

### React Developer Tools
Установите расширение для браузера для отладки React компонентов.

### Redux DevTools (если используется Redux)
```typescript
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

### Логирование
```typescript
// Настройка логирования
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
```

## 📝 Лицензия

Этот проект лицензирован под MIT License.

## 🤝 Вклад в проект

См. основной [README](../../README.md) для информации о том, как внести вклад в проект.

### Стандарты кода
- Используйте TypeScript для всех новых файлов
- Следуйте ESLint правилам
- Добавляйте тесты для новой функциональности
- Используйте функциональные компоненты с хуками
- Применяйте Material-UI компоненты для консистентности 