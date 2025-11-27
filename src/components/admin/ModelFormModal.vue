<template>
  <Transition name="modal-fade">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-5 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
          <h3 class="text-2xl font-bold text-white">
            {{ model ? 'Редактировать модель' : 'Создать модель автомобиля' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Brand -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Марка <span class="text-red-500">*</span>
              <button
                v-if="isNewBrand"
                type="button"
                @click="createNewBrand"
                :disabled="creatingBrand"
                class="text-xs px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {{ creatingBrand ? 'Создание...' : 'Создать новую' }}
              </button>
            </label>
            <input
              type="text"
              v-model="form.brand"
              required
              list="brands-list"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                isNewBrand ? 'border-green-500 bg-green-50' : 'border-gray-300'
              ]"
              placeholder="Введите или выберите марку"
            />
            <datalist id="brands-list">
              <option v-for="brand in allBrands" :key="brand" :value="brand" />
            </datalist>
            <div v-if="isNewBrand" class="mt-1 text-xs text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Новая марка будет создана
            </div>
          </div>

          <!-- Model Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Название модели <span class="text-red-500">*</span>
              <button
                v-if="isNewModelName"
                type="button"
                @click="createNewModelName"
                :disabled="creatingModelName"
                class="text-xs px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {{ creatingModelName ? 'Создание...' : 'Создать новую' }}
              </button>
            </label>
            <input
              type="text"
              v-model="form.model"
              required
              list="models-list"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                isNewModelName ? 'border-green-500 bg-green-50' : 'border-gray-300'
              ]"
              placeholder="Введите или выберите модель"
            />
            <datalist id="models-list">
              <option v-for="modelName in allModels" :key="modelName" :value="modelName" />
            </datalist>
            <div v-if="isNewModelName" class="mt-1 text-xs text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Новая модель будет создана
            </div>
          </div>

          <!-- Body Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Тип кузова <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.bodyType"
              required
              list="bodytypes-list"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Введите или выберите тип кузова"
            />
            <datalist id="bodytypes-list">
              <option v-for="type in allBodyTypes" :key="type" :value="type" />
            </datalist>
            <p class="mt-1 text-xs text-gray-500">
              Тип кузова будет создан вместе с моделью
            </p>
          </div>

          <!-- Car Class -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Класс автомобиля <span class="text-red-500">*</span>
              <button
                v-if="isNewClass"
                type="button"
                @click="createNewClass"
                :disabled="creatingClass"
                class="text-xs px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {{ creatingClass ? 'Создание...' : 'Создать новый' }}
              </button>
            </label>
            <input
              type="text"
              v-model="form.carClass"
              required
              list="classes-list"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                isNewClass ? 'border-green-500 bg-green-50' : 'border-gray-300'
              ]"
              placeholder="Введите или выберите класс"
            />
            <datalist id="classes-list">
              <option v-for="cls in allClasses" :key="cls" :value="cls" />
            </datalist>
            <div v-if="isNewClass" class="mt-1 text-xs text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Новый класс будет создан
            </div>
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
import { ref, computed, watch } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import { 
  getAdminBrands, 
  getAdminModelNames, 
  getAdminClasses,
  createModel, 
  updateModel 
} from '../../services/adminService'
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

// Flags for creating new reference data
const creatingBrand = ref(false)
const creatingModelName = ref(false)
const creatingClass = ref(false)

// Computed properties to detect new values
const isNewBrand = computed(() => {
  return form.value.brand && !allBrands.value.includes(form.value.brand)
})

const isNewModelName = computed(() => {
  return form.value.model && !allModels.value.includes(form.value.model)
})

const isNewClass = computed(() => {
  return form.value.carClass && !props.allClasses.includes(form.value.carClass)
})

const loadOptions = async () => {
  try {
    const [brands, models] = await Promise.all([
      getAdminBrands(),
      getAdminModelNames()
    ])
    allBrands.value = brands
    allModels.value = models
  } catch (err) {
    console.error('Error loading options:', err)
  }
}

// Create new brand
const createNewBrand = async () => {
  if (!form.value.brand || !isNewBrand.value) return
  
  creatingBrand.value = true
  try {
    await api.post('/admin/filters/brands', { name: form.value.brand })
    allBrands.value.push(form.value.brand)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания марки')
  } finally {
    creatingBrand.value = false
  }
}

// Create new model name
const createNewModelName = async () => {
  if (!form.value.model || !isNewModelName.value) return
  
  creatingModelName.value = true
  try {
    await api.post('/admin/filters/models', { name: form.value.model })
    allModels.value.push(form.value.model)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания названия модели')
  } finally {
    creatingModelName.value = false
  }
}

// Create new class
const createNewClass = async () => {
  if (!form.value.carClass || !isNewClass.value) return
  
  creatingClass.value = true
  try {
    await api.post('/admin/filters/classes', { name: form.value.carClass })
    props.allClasses.push(form.value.carClass)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания класса')
  } finally {
    creatingClass.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    // Create new reference data if needed
    if (isNewBrand.value) {
      await createNewBrand()
    }
    
    if (isNewModelName.value) {
      await createNewModelName()
    }
    
    if (isNewClass.value) {
      await createNewClass()
    }

    // Create or update model (body type will be created within the model)
    if (props.model?.id) {
      await updateModel(props.model.id, form.value)
    } else {
      await createModel(form.value)
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
