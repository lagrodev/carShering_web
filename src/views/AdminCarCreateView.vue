<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import { getErrorMessage } from '../utils/errorHandler'
import api from '../services/api'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'

const router = useRouter()
const { showNotification } = useNotification()

const loading = ref(false)
const saving = ref(false)
const allCarStates = ref([])
const allModels = ref([])

const form = ref({
  modelId: '',
  yearOfIssue: new Date().getFullYear(),
  gosNumber: '',
  vin: '',
  rent: 0,
  stateId: ''
})

const imageFile = ref(null)
const imagePreview = ref(null)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const loadOptions = async () => {
  loading.value = true
  try {
    const [statesRes, modelsRes] = await Promise.all([
      api.get('/admin/cars/state'),
      api.get('/admin/models', { params: { size: 1000 } })
    ])
    // Состояния приходят как массив объектов {id, status}
    allCarStates.value = statesRes.data
    allModels.value = modelsRes.data.content
  } catch (error) {
    console.error('Ошибка загрузки опций:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки данных')
    })
  } finally {
    loading.value = false
  }
}

const createCar = async () => {
  console.log('=== СОЗДАНИЕ АВТОМОБИЛЯ ===')
  console.log('Форма:', JSON.stringify(form.value, null, 2))
  console.log('modelId:', form.modelId, 'тип:', typeof form.modelId)
  console.log('form.value.modelId:', form.value.modelId, 'тип:', typeof form.value.modelId)
  
  // Валидация
  if (!form.value.modelId) {
    console.error('❌ Валидация не прошла: modelId =', form.value.modelId)
    showNotification({
      type: 'warning',
      message: 'Выберите модель автомобиля'
    })
    return
  }
  
  console.log('✅ ModelId валидация пройдена')
  
  if (!form.value.gosNumber || !form.value.gosNumber.trim()) {
    showNotification({
      type: 'warning',
      message: 'Введите госномер'
    })
    return
  }
  
  if (!form.value.vin || !form.value.vin.trim()) {
    showNotification({
      type: 'warning',
      message: 'Введите VIN'
    })
    return
  }
  
  if (!imageFile.value) {
    showNotification({
      type: 'warning',
      message: 'Выберите изображение автомобиля'
    })
    return
  }
  
  console.log('✅ Все валидации пройдены, отправка на сервер...')
  
  // Подготовка данных - конвертируем строковые числа в числа
  const carData = {
    modelId: Number(form.value.modelId),
    yearOfIssue: Number(form.value.yearOfIssue),
    gosNumber: form.value.gosNumber.trim(),
    vin: form.value.vin.trim(),
    rent: Number(form.value.rent),
    stateId: Number(form.value.stateId)
  }
  
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }))
    formData.append('image', imageFile.value)
    
    await api.post('/admin/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    showNotification({
      type: 'success',
      message: 'Автомобиль успешно создан'
    })
    router.push('/admin')
  } catch (error) {
    console.error('Ошибка при создании:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка создания автомобиля')
    })
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/admin')
}

onMounted(() => {
  loadOptions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Добавить автомобиль</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Загрузка...</p>
        </div>
      </div>

      <!-- Form -->
      <Card v-else padding="lg">
        <form @submit.prevent="createCar" class="space-y-6">
          <!-- Model Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Модель автомобиля <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.modelId"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="" disabled>Выберите модель</option>
              <option v-for="model in allModels" :key="model.modelId" :value="model.modelId">
                {{ model.brand }} {{ model.model }} ({{ model.carClass }})
              </option>
            </select>
          </div>

          <!-- Year -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Год выпуска <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.yearOfIssue"
              type="number"
              min="1990"
              :max="new Date().getFullYear() + 1"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Gos Number -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Госномер <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.gosNumber"
              type="text"
              placeholder="А123БВ777"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- VIN -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              VIN <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.vin"
              type="text"
              placeholder="WBANE73523CY12345"
              maxlength="17"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Rent Price -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Стоимость аренды (₽/день) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.rent"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Состояние <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.stateId"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="" disabled>Выберите состояние</option>
              <option v-for="state in allCarStates" :key="state.id" :value="state.id">
                {{ state.status }}
              </option>
            </select>
          </div>

          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Изображение автомобиля <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-4">
              <div v-if="imagePreview" class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                <button
                  @click="imageFile = null; imagePreview = null"
                  type="button"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="flex-1">
                <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-700">{{ imageFile ? 'Изменить фото' : 'Выбрать фото' }}</span>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="hidden"
                  />
                </label>
                <p class="text-xs text-gray-500 mt-1">JPG, PNG или GIF (макс. 10MB)</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              :disabled="saving"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Сохранение...' : 'Создать автомобиль' }}
            </Button>
            <Button variant="outline" @click="goBack" type="button">
              Отмена
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>
