<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl md:text-4xl font-bold">Мои договоры</h1>
        <p class="text-primary-100 mt-2">История и активные аренды автомобилей</p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 600px;">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center" style="min-height: 500px;">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Загрузка договоров...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center flex items-center justify-center" style="min-height: 500px;">
        <div>
          <svg class="w-20 h-20 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="loadContracts"
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Попробовать снова
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="contracts.length === 0" class="text-center flex items-center justify-center" style="min-height: 500px;">
        <div>
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">У вас пока нет договоров</h3>
          <p class="text-gray-600 mb-6">Начните арендовать автомобили для удобных поездок</p>
          <button
            @click="$router.push('/')"
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Найти автомобиль
          </button>
        </div>
      </div>

      <!-- Contracts List -->
      <div v-else class="space-y-4">
        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-6">
          <button
            @click="filterStatus = 'all'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              filterStatus === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            Все ({{ contracts.length }})
          </button>
          <button
            @click="filterStatus = 'active'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              filterStatus === 'active'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            Активные ({{ activeContracts.length }})
          </button>
          <button
            @click="filterStatus = 'completed'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              filterStatus === 'completed'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            Завершенные ({{ completedContracts.length }})
          </button>
        </div>

        <!-- Contract Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="contract in filteredContracts"
            :key="contract.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <!-- Contract Header -->
            <div class="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Договор №{{ contract.id }}</h3>
                    <p class="text-sm text-gray-600">{{ contract.brand }} {{ contract.model }}</p>
                  </div>
                </div>
                <span
                  v-if="contract.status"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    getStatusClass(contract.status)
                  ]"
                >
                  {{ getStatusText(contract.status) }}
                </span>
                <span
                  v-else
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    isContractActive(contract) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ isContractActive(contract) ? 'Активный' : 'Завершен' }}
                </span>
              </div>
            </div>

            <!-- Contract Details -->
            <div class="p-6 space-y-4">
              <!-- Car Info -->
              <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="../assets/images/blue-car.png"
                    :alt="`${contract.brand} ${contract.model}`"
                    class="w-full h-full object-contain p-2"
                  />
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ contract.brand }} {{ contract.model }}</p>
                  <p class="text-sm text-gray-600">{{ contract.yearOfIssue }} • {{ formatCarClass(contract.carClass) }}</p>
                  <p class="text-sm text-gray-500">{{ contract.gosNumber }}</p>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Начало
                  </p>
                  <p class="text-gray-900">{{ formatDate(contract.startDate) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Окончание
                  </p>
                  <p class="text-gray-900">{{ formatDate(contract.endDate) }}</p>
                </div>
              </div>

              <!-- Price -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Общая стоимость:</span>
                  <span class="text-2xl font-bold text-primary-600">{{ contract.totalCost?.toFixed(2) || '0.00' }} ₽</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-2 flex gap-2">
                <button
                  @click="viewContract(contract.id)"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserContracts } from '../services/contractService.js'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const router = useRouter()
const contracts = ref([])
const loading = ref(true)
const error = ref(null)
const filterStatus = ref('all')

const activeContracts = computed(() => 
  contracts.value.filter(c => {
    if (c.status) {
      const status = c.status?.toUpperCase()
      return status === 'ACTIVE' || status === 'PENDING' || status === 'CREATED'
    }
    // Если нет статуса, проверяем по дате окончания
    return isContractActive(c)
  })
)

const completedContracts = computed(() => 
  contracts.value.filter(c => {
    if (c.status) {
      const status = c.status?.toUpperCase()
      return status === 'COMPLETED' || status === 'CANCELLED' || status === 'FINISHED'
    }
    // Если нет статуса, проверяем по дате окончания
    return !isContractActive(c)
  })
)

// Проверка активности контракта по дате
const isContractActive = (contract) => {
  if (!contract.endDate) return false
  const endDate = new Date(contract.endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return endDate >= today
}

const filteredContracts = computed(() => {
  if (filterStatus.value === 'all') return contracts.value
  if (filterStatus.value === 'active') return activeContracts.value
  if (filterStatus.value === 'completed') return completedContracts.value
  return contracts.value
})

const loadContracts = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getUserContracts()
    console.log('Загруженные контракты:', data)
    contracts.value = Array.isArray(data) ? data : []
  } catch (err) {
    if (err.response?.status === 401) {
      await router.push('/auth')
    } else {
      error.value = 'Не удалось загрузить договоры. Пожалуйста, попробуйте позже.'
      console.error('Error loading contracts:', err)
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  // Обрабатываем дату в формате ISO, строку "YYYY-MM-DD" или массив [год, месяц, день]
  let date
  if (Array.isArray(dateString)) {
    // Формат [2025, 1, 15] -> месяц нужно уменьшить на 1
    const [year, month, day] = dateString
    date = new Date(year, month - 1, day)
  } else if (typeof dateString === 'string') {
    // Формат "2025-10-30" или ISO строка
    date = new Date(dateString)
  } else {
    return 'N/A'
  }
  
  // Проверка на валидность даты
  if (isNaN(date.getTime())) {
    return 'N/A'
  }
  
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatCarClass = (carClass) => {
  if (!carClass) return ''
  const classMap = {
    'COMPACT': 'Компакт',
    'MID_SIZE': 'Средний',
    'FULL_SIZE': 'Полноразмерный',
    'LUXURY': 'Премиум',
    'SUV': 'Внедорожник',
    'TRUCK': 'Пикап',
    'VAN': 'Фургон',
    'SPORT': 'Спорт'
  }
  return classMap[carClass] || carClass
}

const getStatusText = (status) => {
  if (!status) return 'Неизвестно'
  const upperStatus = status.toUpperCase()
  const statusMap = {
    'ACTIVE': 'Активный',
    'PENDING': 'В ожидании',
    'CREATED': 'Создан',
    'COMPLETED': 'Завершен',
    'CANCELLED': 'Отменен',
    'FINISHED': 'Завершен'
  }
  return statusMap[upperStatus] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700'
  const upperStatus = status.toUpperCase()
  const classMap = {
    'ACTIVE': 'bg-green-100 text-green-700',
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'CREATED': 'bg-blue-100 text-blue-700',
    'COMPLETED': 'bg-gray-100 text-gray-700',
    'CANCELLED': 'bg-red-100 text-red-700',
    'FINISHED': 'bg-gray-100 text-gray-700'
  }
  return classMap[upperStatus] || 'bg-gray-100 text-gray-700'
}

const viewContract = (id) => {
  router.push(`/contracts/${id}`)
}

onMounted(() => {
  loadContracts()
})
</script>