# Примеры использования обновлённого API

## 1. Фильтрация автомобилей с временем

### Запрос
```javascript
// Frontend (Vue.js)
const filters = {
  brand: 'Toyota',
  date_start: '2025-11-25T14:00',  // LocalDateTime
  date_end: '2025-11-27T14:00',     // LocalDateTime
  min_cell: 1000,
  max_cell: 5000
}

const response = await api.get('/car/catalogue', { params: filters })
```

### Пример ответа
```json
{
  "content": [
    {
      "id": 1,
      "brand": "Toyota",
      "model": "Camry",
      "yearOfIssue": 2020,
      "rent": 500.0,
      "status": "AVAILABLE",
      "carClass": "Business",
      "favorite": false
    }
  ],
  "page": {
    "size": 12,
    "number": 0,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

## 2. Создание контракта с временем

### Запрос
```javascript
// Frontend
const contractData = {
  carId: 1,
  dataStart: '2025-11-25T14:00:00',  // LocalDateTime
  dataEnd: '2025-11-25T18:00:00'      // LocalDateTime
}

const response = await api.post('/contracts', contractData)
```

### Пример ответа
```json
{
  "id": 42,
  "totalCost": 2000.0,
  "brand": "Toyota",
  "model": "Camry",
  "bodyType": "Sedan",
  "carClass": "Business",
  "yearOfIssue": 2020,
  "lastName": "Иванов",
  "startDate": "2025-11-25T14:00:00",
  "endDate": "2025-11-25T18:00:00",
  "vin": "1HGBH41JXMN109186",
  "gosNumber": "A123BC",
  "state": "PENDING"
}
```

## 3. Получение статистики пользователя

### Запрос
```javascript
// Frontend
const response = await api.get('/overview/client')
```

### Пример ответа
```json
{
  "favoriteCarId": 5,
  "favoriteCarBrand": "Toyota",
  "favoriteCarModelName": "Camry",
  "favoriteCarCarClass": "Business",
  "favoriteCarImageUrl": "https://example.com/images/car.jpg",
  "totalRides": 25,
  "ridesThisMonth": 5,
  "totalSpent": 75000,
  "favoriteBrand": "BMW",
  "topUsedCarClass": "Premium",
  "lastRideDate": "2025-11-20",
  "averageTimeDrive": 3.5,
  "averageTimeToStartDrive": "14:30:00",
  "averageCost": 850.0
}
```

## 4. Обновление контракта

### Запрос
```javascript
// Frontend
const updateData = {
  dataStart: '2025-11-25T15:00:00',
  dataEnd: '2025-11-25T19:00:00'
}

const response = await api.patch('/contracts/42', updateData)
```

## 5. Фронтенд компоненты

### Выбор даты и времени
```vue
<template>
  <input 
    v-model="dateStart" 
    type="datetime-local" 
    :min="new Date().toISOString().slice(0, 16)"
    class="form-input"
  />
</template>

<script setup>
import { ref } from 'vue'

const dateStart = ref('')

// Отправка на сервер
const createContract = async () => {
  const data = {
    carId: 1,
    dataStart: dateStart.value,  // Уже в формате ISO
    dataEnd: dateEnd.value
  }
  
  await api.post('/contracts', data)
}
</script>
```

### Отображение статистики
```vue
<template>
  <div v-if="stats">
    <p>Всего поездок: {{ stats.totalRides }}</p>
    <p>Потрачено: {{ formatCurrency(stats.totalSpent) }}</p>
    <p>Средняя длительность: {{ stats.averageTimeDrive.toFixed(1) }} ч</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserStats } from '@/services/analyticsService'

const stats = ref(null)

onMounted(async () => {
  stats.value = await getUserStats()
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>
```

## 6. Валидация на фронтенде

### Проверка дат
```javascript
const validateDates = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const now = new Date()
  
  // Проверка: дата не в прошлом
  if (startDate < now || endDate < now) {
    return { valid: false, message: 'Дата не может быть в прошлом' }
  }
  
  // Проверка: конец после начала
  if (endDate < startDate) {
    return { valid: false, message: 'Дата окончания не может быть раньше начала' }
  }
  
  // Проверка: максимум 7 дней
  const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  if (diffDays > 7) {
    return { valid: false, message: 'Максимальная длительность аренды — 7 дней' }
  }
  
  return { valid: true, message: '' }
}
```

### Расчёт стоимости
```javascript
const calculateCost = (start, end, pricePerHour) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  // Длительность в часах
  const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60))
  
  // Длительность в днях для отображения
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  
  // Общая стоимость
  const totalCost = pricePerHour * hours
  
  return { hours, days, totalCost }
}

// Пример использования
const result = calculateCost(
  '2025-11-25T14:00:00',
  '2025-11-25T18:00:00',
  500
)
// { hours: 4, days: 1, totalCost: 2000 }
```

## 7. Обработка ошибок

```javascript
try {
  const response = await api.post('/contracts', contractData)
  console.log('Контракт создан:', response.data)
} catch (error) {
  if (error.response?.status === 400) {
    // Ошибка валидации
    console.error('Неверные данные:', error.response.data)
  } else if (error.response?.status === 404) {
    // Авто не найдено
    console.error('Автомобиль не найден')
  } else {
    // Другие ошибки
    console.error('Ошибка сервера:', error.message)
  }
}
```

## 8. Типы данных (TypeScript)

```typescript
// Фильтры автомобилей
interface CarFilters {
  brand?: string
  model?: string
  minYear?: number
  maxYear?: number
  body_type?: string
  car_class?: string
  date_start?: string  // ISO 8601: "2025-11-25T14:00:00"
  date_end?: string    // ISO 8601: "2025-11-25T18:00:00"
  min_cell?: number
  max_cell?: number
}

// Создание контракта
interface CreateContractRequest {
  carId: number
  dataStart: string  // ISO 8601: "2025-11-25T14:00:00"
  dataEnd: string    // ISO 8601: "2025-11-25T18:00:00"
}

// Статистика пользователя
interface UserStats {
  favoriteCarId?: number
  favoriteCarBrand?: string
  favoriteCarModelName?: string
  favoriteCarCarClass?: string
  favoriteCarImageUrl?: string
  totalRides: number
  ridesThisMonth: number
  totalSpent: number
  favoriteBrand?: string
  topUsedCarClass?: string
  lastRideDate?: string  // ISO 8601 date: "2025-11-20"
  averageTimeDrive?: number
  averageTimeToStartDrive?: string  // Time: "14:30:00"
  averageCost?: number
}
```

## Примечания

- Все даты и время должны быть в формате ISO 8601
- Часовой пояс обрабатывается на стороне клиента
- Валидация выполняется как на фронтенде, так и на бэкенде
- Цены указаны в рублях за час
