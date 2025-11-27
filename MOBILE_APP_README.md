# 🚗 Car Sharing Mobile App - Architecture & Setup Guide

## 📱 Обзор проекта

Мобильное приложение для каршеринга с современным UI/UX дизайном, позволяющее пользователям искать, бронировать и управлять арендой автомобилей.

## 🏗️ Архитектура приложения

### Технологический стек (рекомендуемый)

#### Вариант 1: React Native
```
- React Native 0.72+
- TypeScript
- React Navigation 6.x
- Redux Toolkit / Zustand (state management)
- React Query / TanStack Query (API управление)
- Axios (HTTP клиент)
- React Native Paper / NativeBase (UI компоненты)
- React Hook Form (формы)
- AsyncStorage (локальное хранилище)
```

#### Вариант 2: Flutter
```
- Flutter 3.x
- Dart
- Provider / Bloc (state management)
- Dio (HTTP клиент)
- Go Router (навигация)
- Flutter Hooks
- Shared Preferences (локальное хранилище)
```

#### Вариант 3: Kotlin Multiplatform Mobile (KMM)
```
- Kotlin 1.9+
- Jetpack Compose (Android)
- SwiftUI (iOS)
- Ktor (HTTP клиент)
- SQLDelight (база данных)
- Koin (DI)
```

---

## 📂 Структура проекта (React Native пример)

```
mobile-app/
├── src/
│   ├── api/                        # API интеграция
│   │   ├── client.ts              # Axios конфигурация
│   │   ├── interceptors.ts        # JWT interceptors
│   │   └── endpoints/
│   │       ├── auth.ts            # Аутентификация
│   │       ├── cars.ts            # Каталог машин
│   │       ├── contracts.ts       # Договоры
│   │       ├── profile.ts         # Профиль
│   │       └── documents.ts       # Документы
│   │
│   ├── components/                # Переиспользуемые компоненты
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── cars/
│   │   │   ├── CarCard.tsx
│   │   │   ├── CarDetails.tsx
│   │   │   └── CarFilters.tsx
│   │   ├── contracts/
│   │   │   ├── ContractCard.tsx
│   │   │   └── ContractDetails.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── ProfileStats.tsx
│   │       └── DocumentUpload.tsx
│   │
│   ├── screens/                   # Экраны приложения
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── SearchScreen.tsx
│   │   ├── cars/
│   │   │   ├── CarCatalogueScreen.tsx
│   │   │   └── CarDetailsScreen.tsx
│   │   ├── contracts/
│   │   │   ├── ContractsListScreen.tsx
│   │   │   ├── ContractDetailsScreen.tsx
│   │   │   └── CreateContractScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       ├── EditProfileScreen.tsx
│   │       ├── DocumentsScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/                # Навигация
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── store/                     # State management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── carsSlice.ts
│   │   │   ├── contractsSlice.ts
│   │   │   └── profileSlice.ts
│   │   └── store.ts
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCars.ts
│   │   ├── useContracts.ts
│   │   ├── useProfile.ts
│   │   └── useDebounce.ts
│   │
│   ├── utils/                     # Утилиты
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── storage.ts
│   │
│   ├── types/                     # TypeScript типы
│   │   ├── api.types.ts
│   │   ├── models.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── theme/                     # Тема и стили
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── theme.ts
│   │
│   └── App.tsx                    # Главный компонент
│
├── android/                       # Android специфика
├── ios/                          # iOS специфика
├── assets/                       # Изображения, шрифты
├── __tests__/                    # Тесты
├── .env                          # Переменные окружения
├── package.json
└── tsconfig.json
```

---

## 🔌 API Интеграция

### Base Configuration

```typescript
// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8082/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления JWT токена
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Навигация на экран логина
    }
    return Promise.reject(error);
  }
);
```

---

## 📋 Основные модули API

### 1. 🔐 Аутентификация (Authentication)

```typescript
// src/api/endpoints/auth.ts
import { apiClient } from '../client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
  lastName: string;
  email: string;
}

export const authAPI = {
  // POST /api/auth - Вход
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post('/auth', credentials);
    return response.data;
  },

  // POST /api/registration - Регистрация
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/registration', data);
    return response.data;
  },

  // POST /api/logout - Выход
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
};
```

**Экраны:**
- LoginScreen
- RegisterScreen

---

### 2. 🚙 Каталог автомобилей (Car Catalogue)

```typescript
// src/api/endpoints/cars.ts
import { apiClient } from '../client';

export interface CarFilters {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  body_type?: string;
  car_class?: string;
  page?: number;
  size?: number;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  carClass: string;
  yearOfIssue: number;
  bodyType: string;
  gosNumber: string;
  vin: string;
  status: string;
  rent: number;
}

export const carsAPI = {
  // GET /api/car/catalogue - Получить каталог авто
  getCatalogue: async (filters: CarFilters) => {
    const response = await apiClient.get('/car/catalogue', { params: filters });
    return response.data;
  },

  // GET /api/car/{carId} - Детали автомобиля
  getCarById: async (carId: number) => {
    const response = await apiClient.get(`/car/${carId}`);
    return response.data;
  },

  // GET /api/car/filters/brands - Список брендов
  getBrands: async () => {
    const response = await apiClient.get('/car/filters/brands');
    return response.data;
  },

  // GET /api/car/filters/models - Список моделей
  getModels: async () => {
    const response = await apiClient.get('/car/filters/models');
    return response.data;
  },

  // GET /api/car/filters/classes - Список классов
  getClasses: async () => {
    const response = await apiClient.get('/car/filters/classes');
    return response.data;
  },

  // GET /api/car/filters/body-types - Типы кузова
  getBodyTypes: async () => {
    const response = await apiClient.get('/car/filters/body-types');
    return response.data;
  },
};
```

**Экраны:**
- HomeScreen (с поиском и фильтрами)
- CarCatalogueScreen (список машин)
- CarDetailsScreen (детали автомобиля)

---

### 3. 📄 Управление договорами (Contract Management)

```typescript
// src/api/endpoints/contracts.ts
import { apiClient } from '../client';

export interface CreateContractRequest {
  carId: number;
  dataStart: string; // YYYY-MM-DD
  dataEnd: string;   // YYYY-MM-DD
}

export interface UpdateContractRequest {
  dataStart: string;
  dataEnd: string;
}

export interface Contract {
  id: number;
  totalCost: number;
  brand: string;
  model: string;
  bodyType: string;
  carClass: string;
  yearOfIssue: number;
  lastName: string;
  startDate: string;
  endDate: string;
  vin: string;
  gosNumber: string;
  state: string;
}

export const contractsAPI = {
  // GET /api/contracts - Получить договоры пользователя
  getUserContracts: async (page = 0, size = 20) => {
    const response = await apiClient.get('/contracts', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/contracts/{contractId} - Детали договора
  getContractById: async (contractId: number) => {
    const response = await apiClient.get(`/contracts/${contractId}`);
    return response.data;
  },

  // POST /api/contracts - Создать договор
  createContract: async (data: CreateContractRequest) => {
    const response = await apiClient.post('/contracts', data);
    return response.data;
  },

  // PATCH /api/contracts/{contractId} - Обновить договор
  updateContract: async (contractId: number, data: UpdateContractRequest) => {
    const response = await apiClient.patch(`/contracts/${contractId}`, data);
    return response.data;
  },

  // DELETE /api/contracts/{contractId}/cancel - Отменить договор
  cancelContract: async (contractId: number) => {
    const response = await apiClient.delete(`/contracts/${contractId}/cancel`);
    return response.data;
  },
};
```

**Экраны:**
- ContractsListScreen (список договоров)
- ContractDetailsScreen (детали договора)
- CreateContractScreen (создание договора)

---

### 4. 👤 Профиль пользователя (User Profile)

```typescript
// src/api/endpoints/profile.ts
import { apiClient } from '../client';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  phone: string;
  email: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const profileAPI = {
  // GET /api/profile - Получить профиль
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  // GET /api/profile/me - Краткая информация
  getMe: async () => {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  // PATCH /api/profile - Обновить профиль
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.patch('/profile', data);
    return response.data;
  },

  // PATCH /api/profile/password - Изменить пароль
  changePassword: async (data: ChangePasswordRequest) => {
    const response = await apiClient.patch('/profile/password', data);
    return response.data;
  },

  // DELETE /api/profile - Удалить профиль
  deleteProfile: async () => {
    const response = await apiClient.delete('/profile');
    return response.data;
  },
};
```

**Экраны:**
- ProfileScreen (просмотр профиля)
- EditProfileScreen (редактирование)
- SettingsScreen (настройки)

---

### 5. 📋 Документы (Documents)

```typescript
// src/api/endpoints/documents.ts
import { apiClient } from '../client';

export interface CreateDocumentRequest {
  documentTypeId: number;
  series: string;
  number: string;
  dateOfIssue: string; // YYYY-MM-DD
  issuingAuthority: string;
}

export interface Document {
  id: number;
  documentType: string;
  series: string;
  number: string;
  dateOfIssue: string;
  issuingAuthority: string;
  verified: boolean;
}

export const documentsAPI = {
  // GET /api/profile/document - Получить документ
  getDocument: async () => {
    const response = await apiClient.get('/profile/document');
    return response.data;
  },

  // POST /api/profile/document - Создать документ
  createDocument: async (data: CreateDocumentRequest) => {
    const response = await apiClient.post('/profile/document', data);
    return response.data;
  },

  // PATCH /api/profile/document - Обновить документ
  updateDocument: async (data: Partial<CreateDocumentRequest>) => {
    const response = await apiClient.patch('/profile/document', data);
    return response.data;
  },

  // DELETE /api/profile/document - Удалить документ
  deleteDocument: async () => {
    const response = await apiClient.delete('/profile/document');
    return response.data;
  },
};
```

**Экраны:**
- DocumentsScreen (управление документами)

---

## 🎨 UI/UX Дизайн экранов

### Основные экраны

#### 1. 🏠 Home Screen (Главный экран)
```
- Hero секция с поиском
- Быстрые фильтры (бренд, класс, год)
- Популярные автомобили (карусель)
- Категории автомобилей
- Специальные предложения
```

#### 2. 🔍 Car Catalogue Screen (Каталог)
```
- Фильтры (drawer/modal)
- Сортировка (цена, год, класс)
- Список/сетка автомобилей (карточки)
- Пагинация/бесконечный скролл
- Pull-to-refresh
```

#### 3. 🚗 Car Details Screen (Детали авто)
```
- Галерея изображений (swiper)
- Основная информация (бренд, модель, год)
- Характеристики (класс, кузов, VIN)
- Цена аренды
- Кнопка "Арендовать"
- Календарь доступности
```

#### 4. 📝 Create Contract Screen (Создание договора)
```
- Информация об автомобиле
- Выбор дат (date picker)
- Расчет стоимости
- Подтверждение данных
- Кнопка создания
```

#### 5. 📄 Contracts List Screen (Мои договоры)
```
- Фильтры по статусу (активные/завершенные)
- Карточки договоров
- Статус (цветные бейджи)
- Даты аренды
- Общая стоимость
- Действия (просмотр, отмена)
```

#### 6. 👤 Profile Screen (Профиль)
```
- Аватар с инициалами
- Основная информация
- Статистика (договоры, поездки, рейтинг)
- Управление документами
- Настройки
- Выход из аккаунта
```

---

## 🔧 Настройка проекта

### React Native Setup

```bash
# Создание проекта
npx react-native init CarSharingApp --template react-native-template-typescript

# Установка зависимостей
cd CarSharingApp
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-paper
npm install react-native-vector-icons
npm install react-hook-form
npm install date-fns

# iOS специфичные команды
cd ios && pod install && cd ..

# Запуск приложения
npm run android
# или
npm run ios
```

### Переменные окружения

```bash
# .env
API_BASE_URL=http://localhost:8082/api
API_TIMEOUT=10000
```

---

## 🎯 Основные функции

### Для пользователей:
- ✅ Регистрация и аутентификация
- ✅ Поиск и фильтрация автомобилей
- ✅ Просмотр деталей автомобиля
- ✅ Создание договора аренды
- ✅ Управление активными договорами
- ✅ Просмотр истории аренд
- ✅ Управление профилем
- ✅ Добавление документов
- ✅ Изменение пароля

### Дополнительные функции (рекомендуемые):
- 📍 Геолокация (карта с автомобилями)
- 🔔 Push-уведомления
- 💳 Интеграция платежей
- ⭐ Рейтинг и отзывы
- 📸 Фото автомобилей
- 🌐 Многоязычность
- 🌙 Темная тема
- 📱 Биометрическая аутентификация

---

## 🔐 Безопасность

```typescript
// Хранение токена
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenService = {
  async setToken(token: string) {
    await AsyncStorage.setItem('authToken', token);
  },
  
  async getToken() {
    return await AsyncStorage.getItem('authToken');
  },
  
  async removeToken() {
    await AsyncStorage.removeItem('authToken');
  },
};
```

---

## 📊 State Management (Redux Toolkit)

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/endpoints/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authAPI.login(credentials);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🧪 Тестирование

```typescript
// __tests__/api/cars.test.ts
import { carsAPI } from '../../src/api/endpoints/cars';

describe('Cars API', () => {
  it('should fetch car catalogue', async () => {
    const filters = { page: 0, size: 10 };
    const result = await carsAPI.getCatalogue(filters);
    expect(result).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
  });

  it('should fetch car by id', async () => {
    const carId = 1;
    const result = await carsAPI.getCarById(carId);
    expect(result).toBeDefined();
    expect(result.id).toBe(carId);
  });
});
```

---

## 📱 Навигация

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

```typescript
// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/home/HomeScreen';
import ContractsListScreen from '../screens/contracts/ContractsListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Contracts') iconName = 'file-document';
          else if (route.name === 'Profile') iconName = 'account';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contracts" component={ContractsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

---

## 🎨 Тема и стилизация

```typescript
// src/theme/theme.ts
export const theme = {
  colors: {
    primary: '#4F46E5',      // Indigo
    primaryDark: '#4338CA',
    secondary: '#9333EA',    // Purple
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 14, fontWeight: 'normal' },
  },
};
```

---

## 📦 Сборка и деплой

### Android
```bash
# Генерация подписанного APK
cd android
./gradlew assembleRelease

# Генерация AAB для Google Play
./gradlew bundleRelease
```

### iOS
```bash
# Открыть в Xcode
open ios/CarSharingApp.xcworkspace

# Или через командную строку
xcodebuild -workspace ios/CarSharingApp.xcworkspace \
  -scheme CarSharingApp \
  -configuration Release \
  archive
```

---

## 🔄 CI/CD

### GitHub Actions пример

```yaml
# .github/workflows/mobile.yml
name: Mobile CI/CD

on:
  push:
    branches: [ master, develop ]
  pull_request:
    branches: [ master ]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: cd android && ./gradlew assembleRelease

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: cd ios && pod install
      - run: xcodebuild -workspace ios/CarSharingApp.xcworkspace -scheme CarSharingApp build
```

---

## 📝 Чеклист разработки

### Этап 1: Базовая настройка
- [ ] Инициализация проекта
- [ ] Настройка навигации
- [ ] Конфигурация API клиента
- [ ] Настройка State Management
- [ ] Создание темы и UI компонентов

### Этап 2: Аутентификация
- [ ] Экран входа
- [ ] Экран регистрации
- [ ] Хранение токена
- [ ] Автоматический вход

### Этап 3: Каталог автомобилей
- [ ] Главный экран с поиском
- [ ] Каталог с фильтрами
- [ ] Детальная страница авто
- [ ] Интеграция API

### Этап 4: Договоры
- [ ] Список договоров
- [ ] Создание договора
- [ ] Детали договора
- [ ] Отмена договора

### Этап 5: Профиль
- [ ] Просмотр профиля
- [ ] Редактирование профиля
- [ ] Управление документами
- [ ] Изменение пароля

### Этап 6: Дополнительно
- [ ] Push-уведомления
- [ ] Обработка ошибок
- [ ] Офлайн режим
- [ ] Аналитика
- [ ] Тесты

---

## 🚀 Запуск проекта

```bash
# Клонирование репозитория
git clone <repository-url>
cd mobile-app

# Установка зависимостей
npm install

# iOS подготовка
cd ios && pod install && cd ..

# Запуск Metro bundler
npm start

# Запуск на Android
npm run android

# Запуск на iOS
npm run ios
```

---

## 🐛 Отладка

```typescript
// Включение логирования API запросов
apiClient.interceptors.request.use(config => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
```

---

## 📚 Дополнительные ресурсы

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/)
- [Axios](https://axios-http.com/)

---

## 👥 Команда

- **Frontend Mobile Developer**: Разработка UI/UX
- **Backend Developer**: API endpoints
- **QA Engineer**: Тестирование
- **DevOps**: CI/CD, деплой

---

## 📄 Лицензия

MIT License

---

**Дата создания:** Ноябрь 2025  
**Версия API:** v0  
**Backend URL:** http://localhost:8082
