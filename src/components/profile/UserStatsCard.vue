<script setup>
import { ref, onMounted } from 'vue'
import { getUserStats } from '../../services/analyticsService'

const stats = ref(null)
const loading = ref(true)
const error = ref(false)

const loadStats = async () => {
  loading.value = true
  error.value = false
  try {
    stats.value = await getUserStats()
  } catch (err) {
    console.error('Error loading user stats:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatMinutes = (totalMinutes) => {
  if (!totalMinutes || totalMinutes === 0) return '0 минут'
  
  const minutes = Math.round(totalMinutes)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  // Если больше 24 часов (1440 минут) - показываем в днях
  if (days > 0) {
    const remainingHours = hours % 24
    if (remainingHours > 0) {
      return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} ${remainingHours} ${remainingHours === 1 ? 'час' : 'часов'}`
    }
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`
  }
  
  // Если меньше часа (60 минут) - показываем в минутах
  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`
  }
  
  // Показываем часы и минуты
  const remainingMinutes = minutes % 60
  if (remainingMinutes > 0) {
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} ${remainingMinutes} ${remainingMinutes === 1 ? 'минута' : 'минут'}`
  }
  
  return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
}

const formatTime = (timeString) => {
  if (!timeString) return '—'
  return timeString.slice(0, 5)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="relative bg-gradient-to-br from-white via-primary-50/30 to-purple-50/30 rounded-2xl shadow-xl border-2 border-primary-100/50 overflow-hidden">
    <!-- Декоративные элементы -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-primary-200/20 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="relative z-10">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 px-8 py-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">Статистика использования</h3>
              <p class="text-primary-100 text-sm mt-1">Ваши достижения и активность</p>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-white font-semibold text-sm">Premium</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 flex items-center justify-center">
        <div class="text-center">
          <div class="relative w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="text-sm text-gray-600 font-medium">Загрузка статистики...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold mb-2">Не удалось загрузить статистику</p>
        <p class="text-sm text-gray-500 mb-6">Попробуйте обновить страницу</p>
        <button
          @click="loadStats"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Повторить попытку
        </button>
      </div>

      <!-- Stats Content -->
      <div v-else-if="stats" class="p-8">
        <!-- Favorite Car Section -->
        <div v-if="stats.favoriteCarId" class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <h4 class="text-lg font-bold text-gray-900">Ваш любимый автомобиль</h4>
          </div>
          <div class="relative bg-gradient-to-br from-white to-primary-50/50 rounded-2xl p-6 border-2 border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10 flex items-center gap-6">
              <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <img
                  :src="stats.favoriteCarImageUrl || '/src/assets/images/blue-car.png'"
                  :alt="`${stats.favoriteCarBrand} ${stats.favoriteCarModelName}`"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  @error="(e) => e.target.src = '/src/assets/images/blue-car.png'"
                />
              </div>
              <div class="flex-1">
                <p class="text-2xl font-bold text-gray-900 mb-1">{{ stats.favoriteCarBrand }} {{ stats.favoriteCarModelName }}</p>
                <p class="text-primary-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {{ stats.favoriteCarCarClass }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Rides -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-blue-100 text-xs font-semibold uppercase tracking-wider">Всего</p>
              </div>
              <p class="text-5xl font-black mb-2">{{ stats.totalRides || 0 }}</p>
              <p class="text-blue-100 text-sm">Поездок</p>
            </div>
          </div>

          <!-- Time This Month -->
          <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-green-100 text-xs font-semibold uppercase tracking-wider">Этот месяц</p>
              </div>
              <p class="text-4xl font-black mb-2">{{ formatMinutes(stats.ridesThisMonth) }}</p>
              <p class="text-green-100 text-sm">В дороге</p>
            </div>
          </div>

          <!-- Total Spent -->
          <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-purple-100 text-xs font-semibold uppercase tracking-wider">Потрачено</p>
              </div>
              <p class="text-4xl font-black mb-2">{{ formatCurrency(stats.totalSpent) }}</p>
              <p class="text-purple-100 text-sm">Всего</p>
            </div>
          </div>
        </div>

        <!-- Additional Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Preferences Card -->
          <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Ваши предпочтения</h4>
            </div>
            <div class="space-y-4">
              <div v-if="stats.favoriteBrand" class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <span class="text-sm text-gray-700 font-medium">Любимый бренд</span>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ stats.favoriteBrand }}</span>
              </div>
              <div v-if="stats.topUsedCarClass" class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <span class="text-sm text-gray-700 font-medium">Предпочитаемый класс</span>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ stats.topUsedCarClass }}</span>
              </div>
            </div>
          </div>

          <!-- Activity Card -->
          <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Активность</h4>
            </div>
            <div class="space-y-4">
              <div v-if="stats.averageTimeDrive" class="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Время на поездку</span>
                </div>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ formatMinutes(stats.averageTimeDrive) }}</span>
              </div>
              <div v-if="stats.averageCost" class="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Средняя стоимость за 1 час</span>
                </div>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ formatCurrency(stats.averageCost) }}</span>
              </div>
              <div v-if="stats.averageTimeToStartDrive" class="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Обычное время начала</span>
                </div>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ formatTime(stats.averageTimeToStartDrive) }}</span>
              </div>
              <div v-if="stats.lastRideDate" class="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Последняя поездка</span>
                </div>
                <span class="text-base font-bold text-gray-900 px-3 py-1 bg-white rounded-lg shadow-sm">{{ formatDate(stats.lastRideDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Статистика пока недоступна</h3>
        <p class="text-gray-600 mb-2">Совершите первую поездку, чтобы увидеть статистику</p>
        <p class="text-sm text-gray-500">Здесь будут отображаться ваши достижения и предпочтения</p>
      </div>
    </div>
  </div>
</template>
