<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const error = ref('')

const verifyEmail = async () => {
  const code = route.query.code

  console.log('=== Email Verification Start ===')
  console.log('Code from URL:', code)
  console.log('Full URL:', window.location.href)

  if (!code) {
    console.error('No verification code provided')
    error.value = 'Код верификации не указан'
    loading.value = false
    return
  }

  try {
    // Делаем запрос напрямую к бэкенду с кодом верификации
    const backendUrl = `${api.defaults.baseURL}/verify?code=${code}`
    console.log('Sending request to backend:', backendUrl)
    
    const response = await api.get('/verify', { 
      params: { code }
    })
    
    console.log('Backend response status:', response.status)
    console.log('Backend response data:', response.data)
    
    // Если запрос успешен (любой 2xx статус)
    success.value = true
    console.log('Verification successful!')
    
    // Убрал автоматический редирект
    // setTimeout(() => {
    //   router.push('/profile')
    // }, 3000)
  } catch (err) {
    console.error('=== Verification Error ===')
    console.error('Error object:', err)
    console.error('Error response:', err.response)
    console.error('Error status:', err.response?.status)
    console.error('Error data:', err.response?.data)
    
    if (err.response?.status === 400) {
      error.value = 'Неверный или истекший код верификации'
    } else if (err.response?.status === 404) {
      error.value = 'Пользователь не найден'
    } else {
      error.value = 'Ошибка при верификации email. Попробуйте позже.'
    }
  } finally {
    loading.value = false
    console.log('=== Email Verification End ===')
  }
}

onMounted(() => {
  verifyEmail()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full">
        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="mb-6">
            <svg class="animate-spin h-16 w-16 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Верификация email</h2>
          <p class="text-gray-600">Пожалуйста, подождите...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Email подтвержден!</h2>
          <p class="text-gray-600 mb-6">
            Ваш email успешно подтвержден. Теперь у вас есть полный доступ ко всем функциям сайта.
          </p>
          <button
            @click="router.push('/profile')"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-200"
          >
            Перейти в профиль
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="mb-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Ошибка верификации</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="router.push('/profile')"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться в профиль
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
