<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Header from "../components/layout/Header.vue"; // ← это твой HTTP-клиент

const props = defineProps(['id'])
const car = ref(null)
const isAuthenticated = ref(false)
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
    alert('Ошибка загрузки данных автомобиля: ' + (error.message || 'неизвестная ошибка'))
  }
})

const handleRentClick = () => {
  if (isAuthenticated.value) {
    router.push({ name: 'CreateContract', query: { carId: props.id } })
  } else {
    router.push('/auth')
  }
}
</script>

<template>
  <Header/>

  <div v-if="car" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
    <h1>{{ car.brand }} {{ car.model }}</h1>
    <p><strong>Год:</strong> {{ car.yearOfIssue }}</p>
    <p><strong>Кузов:</strong> {{ car.bodyType }}</p>
    <p><strong>Класс:</strong> {{ car.carClass }}</p>
    <p><strong>Госномер:</strong> {{ car.gosNumber }}</p>
    <p><strong>VIN:</strong> {{ car.vin }}</p>
    <p><strong>Статус:</strong> {{ car.status }}</p>
    <p><strong>Цена:</strong> {{ car.rent }} ₽/день</p>

    <div style="margin-top: 1.5rem;">
      <button
          @click="handleRentClick"
          :disabled="loadingAuth"
          style="
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        "
      >
        <span v-if="loadingAuth">Проверка...</span>
        <span v-else-if="isAuthenticated">Арендовать автомобиль</span>
        <span v-else>Войти / Зарегистрироваться</span>
      </button>
    </div>
  </div>

  <div v-else>
    Загрузка...
  </div>
</template>