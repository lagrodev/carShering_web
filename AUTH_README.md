# Документация по аутентификации

## Обзор

Приложение использует систему аутентификации на основе **HTTP-only cookies** для обеспечения безопасности. JWT токен хранится в cookie на стороне сервера и автоматически отправляется с каждым запросом.

## Архитектура

### Основные компоненты:

1. **authService.js** - Сервис для работы с API аутентификации
2. **auth.js** (Pinia store) - Управление состоянием аутентификации
3. **api.js** - Axios клиент с поддержкой cookies
4. **router/index.js** - Защита маршрутов
5. **AuthView.vue** - Формы входа и регистрации
6. **Header.vue** - Отображение статуса пользователя

## Использование

### 1. Вход в систему

```javascript
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

// Вход
await authStore.login({
  username: 'user',
  password: 'pass'
})

// Проверка статуса
if (authStore.isAuthenticated) {
  console.log('Пользователь авторизован')
}
```

### 2. Регистрация

```javascript
await authStore.register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'securepassword'
})
```

### 3. Выход из системы

```javascript
await authStore.logout()
```

### 4. Получение данных пользователя

```javascript
// Текущий пользователь
const user = authStore.user

// Имя пользователя
const username = authStore.username

// Проверка роли администратора
const isAdmin = authStore.isAdmin

// Все роли
const roles = authStore.userRoles
```

### 5. Защита маршрутов

В `router/index.js` добавьте мета-поле `requiresAuth`:

```javascript
{
  path: '/profile',
  name: 'Profile',
  component: ProfileView,
  meta: { requiresAuth: true }  // Требует аутентификацию
}
```

### 6. Использование в компонентах

```vue
<template>
  <div>
    <div v-if="authStore.isAuthenticated">
      <h1>Привет, {{ authStore.username }}!</h1>
      <p v-if="authStore.isAdmin">Вы администратор</p>
    </div>
    <div v-else>
      <p>Пожалуйста, войдите в систему</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
</script>
```

## API endpoints

### POST /api/auth
**Вход в систему**

Request:
```json
{
  "username": "user",
  "password": "password"
}
```

Response:
```json
{
  "message": "Authentication successful"
}
```
*Cookie `access_token` устанавливается автоматически*

### POST /api/registration
**Регистрация нового пользователя**

Request:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@example.com"
}
```

### POST /api/logout
**Выход из системы**

Response:
```json
{
  "message": "Logged out"
}
```
*Cookie удаляется*

### GET /api/profile/me
**Получение данных текущего пользователя**

Response:
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "authorities": [
    { "authority": "ROLE_USER" }
  ]
}
```

## Безопасность

### Cookie настройки:
- **httpOnly**: true - защита от XSS атак
- **sameSite**: Lax - защита от CSRF
- **path**: /api - cookie отправляется только к API
- **maxAge**: 30 минут

### Axios настройки:
```javascript
{
  baseURL: 'http://localhost:8082/api',
  withCredentials: true,  // Отправка cookies
  timeout: 10000
}
```

## Обработка ошибок

### 401 Unauthorized
При получении 401 ошибки пользователь автоматически перенаправляется на `/auth`:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)
```

## Pinia Store API

### State
- `user` - данные пользователя
- `loading` - состояние загрузки
- `error` - сообщение об ошибке

### Getters
- `isAuthenticated` - авторизован ли пользователь
- `isAdmin` - имеет ли пользователь роль ADMIN/MANAGER
- `username` - имя пользователя
- `userRoles` - список ролей

### Actions
- `login(credentials)` - вход
- `register(userData)` - регистрация
- `logout()` - выход
- `fetchUser()` - загрузка данных пользователя
- `checkAuth()` - проверка аутентификации
- `clearError()` - очистка ошибок

## Роли пользователей

### ROLE_USER
Обычный пользователь. Доступ к:
- Каталогу автомобилей
- Профилю
- Созданию договоров
- Просмотру своих договоров

### ROLE_ADMIN / ROLE_MANAGER
Администратор. Дополнительный доступ к:
- Админ панели
- Управлению всеми ресурсами

## Примеры использования

### Условный рендеринг на основе роли

```vue
<template>
  <div>
    <button v-if="authStore.isAdmin" @click="deleteItem">
      Удалить
    </button>
  </div>
</template>
```

### Загрузка данных после входа

```vue
<script setup>
import { watch } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth) {
    // Загрузить данные пользователя
    await loadUserData()
  }
})
</script>
```

### Защита действий

```javascript
async function deleteItem(id) {
  if (!authStore.isAdmin) {
    alert('Недостаточно прав')
    return
  }
  
  await api.delete(`/items/${id}`)
}
```

## Troubleshooting

### Cookie не отправляются
1. Проверьте `withCredentials: true` в axios
2. Проверьте CORS настройки на бэкенде
3. Убедитесь, что используете один домен для frontend и backend (или настроена правильная CORS политика)

### 401 после успешного входа
1. Проверьте срок действия токена (30 минут)
2. Проверьте path cookie (`/api`)
3. Проверьте что базовый URL axios совпадает с path cookie

### Бесконечный редирект на /auth
1. Проверьте условие в api.interceptors
2. Убедитесь что endpoint `/profile/me` доступен

## Рекомендации

1. **Всегда используйте HTTPS в production**
2. Установите `secure: true` для cookies в production
3. Используйте сильные пароли
4. Регулярно обновляйте токены
5. Логируйте попытки входа
6. Добавьте капчу для защиты от брутфорса
