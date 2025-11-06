<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Back Button -->
      <button
        @click="router.push('/admin')"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к панели администратора
      </button>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Загрузка информации о контракте...</p>
        </div>
      </div>

      <!-- Contract Info -->
      <div v-else-if="contract" class="space-y-6">
        <!-- Header Card -->
        <Card padding="lg">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900">
                  Контракт #{{ contract.id }}
                </h1>
                <span :class="getStatusClass(contract.state)" class="px-3 py-1 text-sm font-semibold rounded-full">
                  {{ translateStatus(contract.state) }}
                </span>
              </div>
              <p class="text-gray-600">{{ contract.brand }} {{ contract.model }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <button
                v-if="contract.state === 'PENDING'"
                @click="confirmContract"
                class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Подтвердить
              </button>
              <button
                v-if="contract.state === 'CANCELLATION_REQUESTED'"
                @click="confirmCancellation"
                class="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Подтвердить отмену
              </button>
              <button
                v-if="contract.state === 'ACTIVE' || contract.state === 'PENDING'"
                @click="cancelContract"
                class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Отменить контракт
              </button>
            </div>
          </div>
        </Card>

        <!-- Main Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Contract Details -->
          <Card padding="lg">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Детали контракта</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Клиент</p>
                <p class="text-base font-semibold text-gray-900">{{ contract.lastName }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Дата начала</p>
                  <p class="text-base font-semibold text-gray-900">{{ formatDate(contract.startDate) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Дата окончания</p>
                  <p class="text-base font-semibold text-gray-900">{{ formatDate(contract.endDate) }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Общая стоимость</p>
                <p class="text-2xl font-bold text-primary-600">{{ contract.totalCost }} ₽</p>
              </div>
            </div>
          </Card>

          <!-- Car Details -->
          <Card padding="lg">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Информация об автомобиле</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Марка и модель</p>
                <p class="text-base font-semibold text-gray-900">{{ contract.brand }} {{ contract.model }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Год выпуска</p>
                  <p class="text-base font-semibold text-gray-900">{{ contract.yearOfIssue }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Класс</p>
                  <p class="text-base font-semibold text-gray-900">{{ contract.carClass }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Тип кузова</p>
                  <p class="text-base font-semibold text-gray-900">{{ contract.bodyType }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Гос. номер</p>
                  <p class="text-base font-semibold text-gray-900">{{ contract.gosNumber }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">VIN</p>
                <p class="text-base font-semibold text-gray-900">{{ contract.vin }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-20">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Контракт не найден</h3>
        <p class="text-gray-600 mb-6">Не удалось загрузить информацию о контракте</p>
        <Button variant="primary" @click="router.push('/admin')">Вернуться к панели</Button>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getErrorMessage } from '../utils/errorHandler'
import { useNotification } from '../composables/useNotification'
import api from '../services/api'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const { showNotification, showConfirm } = useNotification()

const contract = ref(null)
const loading = ref(false)

const loadContract = async () => {
  loading.value = true
  try {
    const response = await api.get(`/admin/contracts/${route.params.id}`)
    contract.value = response.data
  } catch (error) {
    console.error('Error loading contract:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки контракта')
    })
  } finally {
    loading.value = false
  }
}

const translateStatus = (status) => {
  const translations = {
    'ACTIVE': 'Активный',
    'PENDING': 'В ожидании',
    'COMPLETED': 'Завершен',
    'CANCELLED': 'Отменен',
    'CANCELLATION_REQUESTED': 'Запрошена отмена'
  }
  return translations[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-blue-100 text-blue-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'CANCELLATION_REQUESTED': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const confirmContract = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение контракта',
    message: 'Вы уверены, что хотите подтвердить этот контракт?'
  })
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/contracts/${contract.value.id}/confirm`)
    await loadContract()
    showNotification({
      type: 'success',
      message: 'Контракт успешно подтвержден'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка подтверждения контракта')
    })
  }
}

const cancelContract = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Отмена контракта',
    message: 'Вы уверены, что хотите отменить этот контракт?'
  })
  if (!confirmed) return
  
  try {
    await api.delete(`/admin/contracts/${contract.value.id}/cancel`)
    await loadContract()
    showNotification({
      type: 'success',
      message: 'Контракт успешно отменен'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка отмены контракта')
    })
  }
}

const confirmCancellation = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение отмены контракта',
    message: 'Вы уверены, что хотите подтвердить отмену этого контракта?'
  })
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/contracts/contracts/${contract.value.id}/confirm-cancellation`)
    await loadContract()
    showNotification({
      type: 'success',
      message: 'Отмена контракта подтверждена'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка подтверждения отмены')
    })
  }
}

onMounted(() => {
  loadContract()
})
</script>
