<template>
  <Transition name="modal-fade">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <!-- Header -->
        <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">
            {{ model ? 'Редактировать модель' : 'Добавить модель' }}
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
          <!-- Brand -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Марка <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.brand"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Выберите марку</option>
              <option v-for="brand in allBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>

          <!-- Model Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Модель <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.model"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Выберите модель</option>
              <option v-for="modelName in allModels" :key="modelName" :value="modelName">{{ modelName }}</option>
            </select>
          </div>

          <!-- Body Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Тип кузова <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.bodyType"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Выберите тип</option>
              <option v-for="type in allBodyTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- Car Class -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Класс <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.carClass"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Выберите класс</option>
              <option v-for="cls in allClasses" :key="cls" :value="cls">{{ cls }}</option>
            </select>
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
              {{ saving ? 'Сохранение...' : (model ? 'Сохранить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import api from '../../services/api'

const props = defineProps({
  model: {
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
  brand: '',
  model: '',
  bodyType: '',
  carClass: ''
})

const allBrands = ref([])
const allModels = ref([])
const saving = ref(false)
const error = ref('')

const loadOptions = async () => {
  try {
    const [brandsRes, modelsRes] = await Promise.all([
      api.get('/car/filters/brands'),
      api.get('/car/filters/models')
    ])
    allBrands.value = brandsRes.data
    allModels.value = modelsRes.data
  } catch (err) {
    console.error('Error loading options:', err)
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    if (props.model?.id) {
      // Update existing model
      await api.patch(`/admin/models/${props.model.id}`, form.value)
    } else {
      // Create new model
      await api.post('/admin/models', form.value)
    }
    emit('saved')
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка сохранения модели')
  } finally {
    saving.value = false
  }
}

watch(() => props.model, (newModel) => {
  if (newModel) {
    form.value = {
      brand: newModel.brand || '',
      model: newModel.model || '',
      bodyType: newModel.bodyType || '',
      carClass: newModel.carClass || ''
    }
  } else {
    form.value = {
      brand: '',
      model: '',
      bodyType: '',
      carClass: ''
    }
  }
  loadOptions()
}, { immediate: true })
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
