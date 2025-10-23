<!-- views/CreateContractView.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clientApi } from '../api/client.js'

const route = useRoute()
const router = useRouter()

const carId = ref(null)
const dataStart = ref('')
const dataEnd = ref('')
const car = ref(null)
const loading = ref(false)
const error = ref('')

// Вспомогательная функция: безопасное сравнение дат без часовых поясов
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

// Сегодня и максимум — ровно через 365 дней
const today = new Date()
const maxDateGlobal = new Date(today)
maxDateGlobal.setFullYear(today.getFullYear() + 1) // точнее, чем +365 дней
// Убираем время для чистого сравнения
today.setHours(0, 0, 0, 0)
maxDateGlobal.setHours(0, 0, 0, 0)

const todayStr = today.toISOString().slice(0, 10)
const maxDateStr = maxDateGlobal.toISOString().slice(0, 10)

// Макс. дата окончания: start + 7 дней, но не позже maxDateGlobal
const maxEndDate = computed(() => {
  if (!dataStart.value) return maxDateStr
  const start = parseDate(dataStart.value)
  const endLimit = new Date(start)
  endLimit.setDate(start.getDate() + 7)
  return (endLimit > maxDateGlobal ? maxDateGlobal : endLimit).toISOString().slice(0, 10)
})

// Мин. дата окончания — дата начала
const minEndDate = computed(() => dataStart.value || todayStr)

// Автоматически корректируем dataEnd, если он стал меньше dataStart
watch(dataStart, (newStart) => {
  if (newStart && dataEnd.value && parseDate(dataEnd.value) < parseDate(newStart)) {
    dataEnd.value = newStart
  }
})

// Живая валидация (можно использовать в UI)
const validation = computed(() => {
  if (!dataStart.value || !dataEnd.value) {
    return { valid: false, message: 'Укажите обе даты аренды' }
  }

  const start = parseDate(dataStart.value)
  const end = parseDate(dataEnd.value)

  if (start < today || end < today) {
    return { valid: false, message: 'Дата не может быть в прошлом' }
  }

  if (end < start) {
    return { valid: false, message: 'Дата окончания не может быть раньше начала' }
  }

  const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24))
  if (diffDays > 7) {
    return { valid: false, message: 'Максимальная длительность аренды — 7 дней' }
  }

  if (start > maxDateGlobal || end > maxDateGlobal) {
    return { valid: false, message: 'Аренда возможна не позднее чем через год от сегодня' }
  }

  return { valid: true, message: '' }
})

// Синхронизируем ошибку с валидацией
watch(validation, (val) => {
  error.value = val.message
})

onMounted(async () => {
  const id = route.query.carId
  if (!id) return router.push('/catalogue')
  carId.value = Number(id)
  try {
    car.value = await clientApi.getCar(carId.value)
  } catch {
    alert('Не удалось загрузить автомобиль')
    router.push('/catalogue')
  }
})

const handleSubmit = async () => {
  if (!validation.value.valid) return

  try {
    loading.value = true
    await clientApi.createContract({
      carId: carId.value,
      dataStart: dataStart.value,
      dataEnd: dataEnd.value
    })
    router.push('/profile')
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось создать договор'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="create-contract">
    <h2>Аренда автомобиля</h2>
    <p v-if="car" class="car-info">{{ car.brand }} {{ car.model }}</p>

    <form @submit.prevent="handleSubmit" class="contract-form">
      <div class="form-group">
        <label for="start-date">Дата начала аренды</label>
        <input
            id="start-date"
            type="date"
            v-model="dataStart"
            :min="todayStr"
            :max="maxDateStr"
            class="form-input"
            :class="{ 'form-input--error': !validation.valid && (!dataStart || parseDate(dataStart) < today) }"
        />
      </div>

      <div class="form-group">
        <label for="end-date">Дата окончания аренды</label>
        <input
            id="end-date"
            type="date"
            v-model="dataEnd"
            :min="minEndDate"
            :max="maxEndDate"
            class="form-input"
            :class="{ 'form-input--error': !validation.valid && (!dataEnd || parseDate(dataEnd) < parseDate(dataStart)) }"
            :disabled="!dataStart"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
          type="submit"
          :disabled="loading || !validation.valid"
          class="submit-btn"
      >
        {{ loading ? 'Создание договора…' : 'Подтвердить аренду' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-contract {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.create-contract h2 {
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: 700;
}

.car-info {
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.contract-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  background: #fff;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-input:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-input--error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.error-message {
  color: #ef4444;
  font-size: 0.95rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  font-weight: 500;
}

.submit-btn {
  padding: 0.875rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}
</style>