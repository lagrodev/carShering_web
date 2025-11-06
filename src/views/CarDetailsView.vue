<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import api from '../services/api'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Button from '../components/ui/Button.vue'

const props = defineProps(['id'])
const { showNotification } = useNotification()
const car = ref(null)
const isAuthenticated = ref(false)
const loading = ref(true)
const loadingAuth = ref(true)

const router = useRouter()

const checkAuth = async () => {
  try {
    await api.get('/profile')
    isAuthenticated.value = true
  } catch (error) {
    if (error.response?.status === 401) {
      isAuthenticated.value = false
    } else {
      console.error('Auth check error:', error)
    }
  } finally {
    loadingAuth.value = false
  }
}

onMounted(async () => {
  console.log('Загрузка автомобиля с ID:', props.id)
  try {
    const response = await api.get(`/car/${props.id}`)
    console.log('Ответ от API:', response.data)
    car.value = response.data
    await checkAuth()
  } catch (error) {
    console.error('Ошибка загрузки авто:', error)
    showNotification({
      type: 'error',
      message: 'Ошибка загрузки данных автомобиля: ' + (error.message || 'неизвестная ошибка')
    })
  } finally {
    loading.value = false
  }
})

const handleRentClick = () => {
  if (isAuthenticated.value) {
    router.push({ name: 'CreateContract', query: { carId: props.id } })
  } else {
    router.push('/auth')
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header/>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center" style="min-height: 600px;">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка информации об автомобиле...</p>
      </div>
    </div>

    <!-- Car Details -->
    <main v-else-if="car" class="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 600px;">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="font-medium">Назад к списку</span>
      </button>

      <!-- Main Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Image Section -->
        <div class="relative bg-gradient-to-br from-primary-100 to-purple-100 aspect-video md:aspect-[21/9]">
          <img
            src="../assets/images/blue-car.png"
            :alt="`${car.brand} ${car.model}`"
            class="w-full h-full object-contain p-8"
          />
          <!-- Status Badge -->
          <div class="absolute top-6 right-6">
            <span 
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold shadow-lg',
                car.status === 'AVAILABLE' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              ]"
            >
              {{ car.status === 'AVAILABLE' ? 'Доступен' : 'Недоступен' }}
            </span>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-8 md:p-10">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {{ car.brand }} {{ car.model }}
            </h1>
            <div class="flex items-center gap-3 text-gray-600">
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ car.yearOfIssue }} год
              </span>
              <span class="text-gray-300">•</span>
              <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {{ car.carClass }}
              </span>
            </div>
          </div>

          <!-- Specifications Grid -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Характеристики</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-primary-100 rounded-lg">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-0.5">Тип кузова</p>
                  <p class="font-semibold text-gray-900">{{ car.bodyType || '—' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-primary-100 rounded-lg">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-0.5">Класс автомобиля</p>
                  <p class="font-semibold text-gray-900">{{ car.carClass || '—' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-primary-100 rounded-lg">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-0.5">Госномер</p>
                  <p class="font-semibold text-gray-900">{{ car.gosNumber || '—' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-primary-100 rounded-lg">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-0.5">VIN номер</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ car.vin || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Price and Action -->
          <div class="border-t border-gray-200 pt-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <!-- Price -->
              <div>
                <p class="text-sm text-gray-500 mb-1">Стоимость аренды</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-5xl font-bold text-primary-600">{{ car.rent }}</span>
                  <span class="text-2xl text-gray-500">₽</span>
                  <span class="text-lg text-gray-400">/час</span>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex flex-col gap-3">
                <!-- Authenticated User: Rent Button -->
                <Button
                  v-if="isAuthenticated && !loadingAuth"
                  variant="primary"
                  size="lg"
                  @click="handleRentClick"
                  class="min-w-[280px]"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Арендовать автомобиль
                </Button>

                <!-- Guest User: Auth Message -->
                <div v-else-if="!loadingAuth" class="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-base font-semibold text-amber-900 mb-2">Требуется авторизация</h4>
                      <p class="text-sm text-amber-800 mb-4">
                        Войдите в систему, чтобы воспользоваться нашими услугами и оформить аренду автомобиля.
                      </p>
                      <Button
                        variant="primary"
                        @click="router.push('/auth')"
                        class="w-full"
                      >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Войти в систему
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-else class="flex items-center justify-center py-4">
                  <svg class="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer/>
  </div>
</template>