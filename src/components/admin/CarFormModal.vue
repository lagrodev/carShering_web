<template>
  <Transition name="modal-fade">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">
            {{ car ? 'Редактировать автомобиль' : 'Добавить автомобиль' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Model Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Модель <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.modelId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Выберите модель</option>
              <option v-for="model in models" :key="model.id" :value="model.id">
                {{ model.brand }} {{ model.model }} ({{ model.bodyType }}, {{ model.carClass }})
              </option>
            </select>
          </div>

          <!-- Year of Issue -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Год выпуска <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.yearOfIssue"
              type="number"
              min="1900"
              :max="new Date().getFullYear() + 1"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="2020"
            />
          </div>

          <!-- Gos Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Гос. номер <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.gosNumber"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="А123БВ777"
            />
          </div>

          <!-- VIN -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              VIN <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.vin"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1HGBH41JXMN109186"
            />
          </div>

          <!-- Rent -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Стоимость аренды (₽/день) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.rent"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="5000"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {{ error }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {{ saving ? 'Сохранение...' : (car ? 'Сохранить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import api from '../../services/api'

const props = defineProps({
  car: {
    type: Object,
    default: null
  },
  allBodyTypes: {
    type: Array,
    default: () => []
  },
  allClasses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  modelId: '',
  yearOfIssue: new Date().getFullYear(),
  gosNumber: '',
  vin: '',
  rent: 0
})

const models = ref([])
const saving = ref(false)
const error = ref('')

const loadModels = async () => {
  try {
    const response = await api.get('/admin/models', { params: { size: 1000 } })
    models.value = response.data.content
  } catch (err) {
    console.error('Error loading models:', err)
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    if (props.car) {
      // Update existing car - все поля как в UpdateCarRequest
      await api.patch(`/admin/cars/${props.car.carId}`, {
        modelId: form.value.modelId,
        yearOfIssue: form.value.yearOfIssue,
        gosNumber: form.value.gosNumber,
        vin: form.value.vin,
        rent: form.value.rent
      })
    } else {
      // Create new car
      await api.post('/admin/cars', form.value)
    }
    emit('saved')
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка сохранения автомобиля')
  } finally {
    saving.value = false
  }
}

watch(() => props.car, (newCar) => {
  if (newCar) {
    form.value = {
      modelId: newCar.modelId || '',
      yearOfIssue: newCar.yearOfIssue || new Date().getFullYear(),
      gosNumber: newCar.gosNumber || '',
      vin: newCar.vin || '',
      rent: newCar.rent || 0
    }
  }
}, { immediate: true })

onMounted(() => {
  loadModels()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
