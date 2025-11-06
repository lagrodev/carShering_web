<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import api from '../services/api'
import { getErrorMessage } from '../utils/errorHandler'
import Button from '../components/ui/Button.vue'

const props = defineProps(['id'])
const { showNotification } = useNotification()
const car = ref(null)
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)

const allCarStates = ref([])
const allModels = ref([])

const editForm = ref({
  modelId: null,
  yearOfIssue: 0,
  gosNumber: '',
  vin: '',
  rent: 0,
  status: ''
})

const router = useRouter()

const translateState = (state) => {
  const translations = {
    'AVAILABLE': 'Доступен',
    'UNAVAILABLE': 'Недоступен',
    'IN_USE': 'В аренде',
    'MAINTENANCE': 'Обслуживание',
    'RESERVED': 'Зарезервирован',
    'CLOSED': 'Закрыт'
  }
  return translations[state] || state
}

const getStateClass = (state) => {
  const classes = {
    'AVAILABLE': 'bg-green-500 text-white',
    'UNAVAILABLE': 'bg-gray-500 text-white',
    'IN_USE': 'bg-blue-500 text-white',
    'MAINTENANCE': 'bg-yellow-500 text-white',
    'RESERVED': 'bg-purple-500 text-white',
    'CLOSED': 'bg-red-500 text-white'
  }
  return classes[state] || 'bg-gray-500 text-white'
}

const loadCarDetails = async () => {
  loading.value = true
  try {
    const response = await api.get(`/admin/cars/${props.id}`)
    car.value = response.data
    
    // Заполняем форму редактирования
    editForm.value = {
      modelId: response.data.modelId,
      yearOfIssue: response.data.yearOfIssue,
      gosNumber: response.data.gosNumber,
      vin: response.data.vin,
      rent: response.data.rent,
      status: response.data.status
    }
  } catch (error) {
    console.error('Ошибка загрузки авто:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки данных автомобиля')
    })
  } finally {
    loading.value = false
  }
}

const loadOptions = async () => {
  try {
    const [statesRes, modelsRes] = await Promise.all([
      api.get('/admin/cars/state'),
      api.get('/admin/models', { params: { size: 1000 } })
    ])
    // Состояния приходят как массив объектов {id, status}, извлекаем только status
    allCarStates.value = statesRes.data.map(state => state.status)
    allModels.value = modelsRes.data.content
  } catch (error) {
    console.error('Ошибка загрузки опций:', error)
  }
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Восстанавливаем данные из car - сохраняем modelId как число
  editForm.value = {
    modelId: car.value.modelId,
    yearOfIssue: car.value.yearOfIssue,
    gosNumber: car.value.gosNumber,
    vin: car.value.vin,
    rent: car.value.rent,
    status: car.value.status
  }
}

const saveChanges = async () => {
  // Валидация
  if (!editForm.value.modelId) {
    showNotification({
      type: 'warning',
      message: 'Выберите модель автомобиля'
    })
    return
  }
  
  if (!editForm.value.gosNumber?.trim()) {
    showNotification({
      type: 'warning',
      message: 'Введите госномер'
    })
    return
  }
  
  if (!editForm.value.vin?.trim()) {
    showNotification({
      type: 'warning',
      message: 'Введите VIN'
    })
    return
  }
  
  saving.value = true
  try {
    // 1. Обновляем основные данные (без status)
    const updateData = {
      modelId: Number(editForm.value.modelId),
      yearOfIssue: Number(editForm.value.yearOfIssue),
      gosNumber: editForm.value.gosNumber.trim(),
      vin: editForm.value.vin.trim(),
      rent: Number(editForm.value.rent)
    }
    
    await api.patch(`/admin/cars/${props.id}`, updateData)
    
    // 2. Обновляем состояние отдельным запросом (если изменилось)
    if (editForm.value.status !== car.value.status) {
      await api.patch(`/admin/cars/${props.id}/state`, {
        stateName: editForm.value.status
      })
    }
    
    await loadCarDetails()
    isEditing.value = false
    showNotification({
      type: 'success',
      message: 'Изменения сохранены успешно'
    })
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error)
    console.error('Детали:', error.response?.data)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка сохранения изменений')
    })
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/admin')
}

onMounted(() => {
  loadCarDetails()
  loadOptions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center" style="min-height: 600px;">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка информации об автомобиле...</p>
      </div>
    </div>

    <!-- Car Details -->
    <main v-else-if="car" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              :class="['px-4 py-2 rounded-full text-sm font-semibold shadow-lg', getStateClass(car.status)]"
            >
              {{ translateState(car.status) }}
            </span>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-8 md:p-10">
          <!-- Header -->
          <div class="mb-8 flex items-start justify-between">
            <div>
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
            
            <!-- Edit Toggle Button -->
            <button
              v-if="!isEditing"
              @click="startEdit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing">
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

            <!-- Price -->
            <div class="border-t border-gray-200 pt-8">
              <p class="text-sm text-gray-500 mb-1">Стоимость аренды</p>
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-bold text-primary-600">{{ car.rent }}</span>
                <span class="text-2xl text-gray-500">₽</span>
                <span class="text-lg text-gray-400">/день</span>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Редактирование характеристик</h2>
            <form @submit.prevent="saveChanges" class="space-y-6">
              <!-- Model Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Модель *</label>
                <select
                  v-model.number="editForm.modelId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option :value="null" disabled>Выберите модель</option>
                  <option 
                    v-for="model in allModels" 
                    :key="model.modelId" 
                    :value="model.modelId"
                  >
                    {{ model.brand }} {{ model.model }} ({{ model.carClass }})
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Year -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Год выпуска *</label>
                  <input
                    v-model.number="editForm.yearOfIssue"
                    type="number"
                    min="1900"
                    :max="new Date().getFullYear() + 1"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <!-- Gos Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Гос. номер *</label>
                  <input
                    v-model="editForm.gosNumber"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <!-- VIN -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                  <input
                    v-model="editForm.vin"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <!-- Rent -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Цена (₽/день) *</label>
                  <input
                    v-model.number="editForm.rent"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Состояние *</label>
                <select
                  v-model="editForm.status"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option v-for="state in allCarStates" :key="state" :value="state">
                    {{ translateState(state) }}
                  </option>
                </select>
              </div>

              <!-- Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
