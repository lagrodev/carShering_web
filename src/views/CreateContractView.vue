<!-- views/CreateContractView.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import { clientApi } from '../api/client.js'
import { getErrorMessage } from '../utils/errorHandler'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Button from '../components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const { showNotification } = useNotification()

const carId = ref(null)
const dataStart = ref('')
const dataEnd = ref('')
const car = ref(null)
const loading = ref(false)
const loadingCar = ref(true)
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
  if (!id) return router.push('/')
  carId.value = Number(id)
  try {
    car.value = await clientApi.getCar(carId.value)
  } catch {
    showNotification({
      type: 'error',
      message: 'Не удалось загрузить автомобиль'
    })
    router.push('/')
  } finally {
    loadingCar.value = false
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
    router.push('/contracts')
  } catch (err) {
    error.value = getErrorMessage(err, 'Не удалось создать договор')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push(`/car/${carId.value}`)
}

// Вычисляем длительность аренды в днях
const rentalDuration = computed(() => {
  if (!dataStart.value || !dataEnd.value) return 0
  const start = parseDate(dataStart.value)
  const end = parseDate(dataEnd.value)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
})

// Вычисляем общую стоимость
const totalCost = computed(() => {
  if (!car.value || rentalDuration.value === 0) return 0
  return (car.value.rent * rentalDuration.value).toFixed(2)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header/>

    <!-- Loading State -->
    <div v-if="loadingCar" class="flex-1 flex items-center justify-center" style="min-height: 600px;">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка информации...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 600px;">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="font-medium">Назад к автомобилю</span>
      </button>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Оформление аренды</h1>
        <p v-if="car" class="text-xl text-gray-600">{{ car.brand }} {{ car.model }} ({{ car.yearOfIssue }})</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Выберите даты аренды</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Date Start -->
              <div class="space-y-2">
                <label for="start-date" class="block text-sm font-medium text-gray-700">
                  Дата начала аренды
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="start-date"
                    type="date"
                    v-model="dataStart"
                    :min="todayStr"
                    :max="maxDateStr"
                    class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    :class="{ 
                      'border-gray-300': validation.valid || !dataStart,
                      'border-red-300 bg-red-50': !validation.valid && dataStart && parseDate(dataStart) < today
                    }"
                  />
                </div>
              </div>

              <!-- Date End -->
              <div class="space-y-2">
                <label for="end-date" class="block text-sm font-medium text-gray-700">
                  Дата окончания аренды
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="end-date"
                    type="date"
                    v-model="dataEnd"
                    :min="minEndDate"
                    :max="maxEndDate"
                    :disabled="!dataStart"
                    class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :class="{ 
                      'border-gray-300': validation.valid || !dataEnd,
                      'border-red-300 bg-red-50': !validation.valid && dataEnd
                    }"
                  />
                </div>
                <p v-if="!dataStart" class="text-sm text-gray-500 mt-1">
                  Сначала выберите дату начала аренды
                </p>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-red-800 font-medium">{{ error }}</p>
              </div>

              <!-- Info Box -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-sm text-blue-800">
                    <p class="font-medium mb-1">Условия аренды:</p>
                    <ul class="list-disc list-inside space-y-1 text-blue-700">
                      <li>Максимальная длительность аренды — 7 дней</li>
                      <li>Бронирование доступно на год вперед</li>
                      <li>Дата начала не может быть в прошлом</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <Button
                type="submit"
                variant="primary"
                size="lg"
                :disabled="loading || !validation.valid"
                class="w-full"
              >
                <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Создание договора...' : 'Подтвердить аренду' }}
              </Button>
            </form>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Сводка заказа</h3>
            
            <!-- Car Info -->
            <div v-if="car" class="mb-6 pb-6 border-b border-gray-200">
              <div class="aspect-video bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg mb-3 overflow-hidden">
                <img
                  src="../assets/images/blue-car.png"
                  :alt="`${car.brand} ${car.model}`"
                  class="w-full h-full object-contain p-4"
                />
              </div>
              <h4 class="font-semibold text-gray-900">{{ car.brand }} {{ car.model }}</h4>
              <p class="text-sm text-gray-600">{{ car.yearOfIssue }} • {{ car.carClass }}</p>
            </div>

            <!-- Rental Details -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Цена за час:</span>
                <span class="font-semibold text-gray-900">{{ car?.rent || 0 }} ₽</span>
              </div>
              
              <div v-if="rentalDuration > 0" class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Длительность:</span>
                <span class="font-semibold text-gray-900">{{ rentalDuration }} {{ rentalDuration === 1 ? 'день' : rentalDuration < 5 ? 'дня' : 'дней' }}</span>
              </div>
            </div>

            <!-- Total Price -->
            <div v-if="totalCost > 0" class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 font-medium">Итого:</span>
                <div class="text-right">
                  <div class="text-2xl font-bold text-primary-600">{{ totalCost }} ₽</div>
                  <div class="text-xs text-gray-500">за весь период</div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-gray-500 text-sm">
              Выберите даты для расчета стоимости
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer/>
  </div>
</template>
