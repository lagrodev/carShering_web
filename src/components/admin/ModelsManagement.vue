<template>
  <div>
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Управление моделями</h2>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Добавить модель
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        v-model="filters.brand"
        @input="loadModels"
        type="text"
        placeholder="Марка"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <select
        v-model="filters.bodyType"
        @change="loadModels"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">Все типы кузова</option>
        <option v-for="type in allBodyTypes" :key="type" :value="type">{{ type }}</option>
      </select>
      <select
        v-model="filters.carClass"
        @change="loadModels"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">Все классы</option>
        <option v-for="cls in allClasses" :key="cls" :value="cls">{{ cls }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Models Grid -->
    <div v-else-if="models.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="model in models"
        :key="model.id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900">
              {{ model.brand }}
            </h3>
            <p class="text-gray-600 font-semibold">{{ model.model }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="openEditModal(model)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Редактировать"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteModel(model.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Удалить"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
            {{ model.bodyType }}
          </span>
          <span class="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
            {{ model.carClass }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-900">Модели не найдены</h3>
      <p class="mt-2 text-gray-600">Попробуйте изменить фильтры или добавьте новую модель</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1 && !loading" class="mt-6">
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page - 1)"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all',
            currentPage === page - 1
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModelFormModal
      v-if="showModal"
      :model="selectedModel"
      :all-body-types="allBodyTypes"
      :all-classes="allClasses"
      @close="closeModal"
      @saved="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import { useNotification } from '../../composables/useNotification'
import ModelFormModal from './ModelFormModal.vue'
import api from '../../services/api'

const { showNotification, showConfirm } = useNotification()

const models = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedModel = ref(null)
const currentPage = ref(0)
const totalPages = ref(0)

const allBodyTypes = ref([])
const allClasses = ref([])

const filters = ref({
  brand: '',
  bodyType: '',
  carClass: ''
})

const loadFilterOptions = async () => {
  try {
    const [bodyTypesRes, classesRes] = await Promise.all([
      api.get('/car/filters/body-types'),
      api.get('/admin/filters/classes')
    ])
    allBodyTypes.value = bodyTypesRes.data
    allClasses.value = classesRes.data
  } catch (error) {
    console.error('Не удалось загрузить опции фильтров:', error)
  }
}

const loadModels = async (page = 0) => {
  loading.value = true
  try {
    const params = {
      page,
      size: 20,
      sort: 'brand',
      ...(filters.value.brand && { brand: filters.value.brand }),
      ...(filters.value.bodyType && { body_type: filters.value.bodyType }),
      ...(filters.value.carClass && { car_class: filters.value.carClass })
    }
    
    const response = await api.get('/admin/models', { params })
    models.value = response.data.content
    currentPage.value = response.data.page.number
    totalPages.value = response.data.page.totalPages
  } catch (error) {
    console.error('Error loading models:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки моделей')
    })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedModel.value = null
  showModal.value = true
}

const openEditModal = (model) => {
  selectedModel.value = model
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedModel.value = null
}

const handleSave = () => {
  closeModal()
  loadModels(currentPage.value)
}

const deleteModel = async (modelId) => {
  const confirmed = await showConfirm({
    type: 'error',
    title: 'Удаление модели',
    message: 'Вы уверены, что хотите удалить эту модель? Это действие необратимо. Модель может быть привязана к существующим автомобилям.'
  })
  
  if (!confirmed) return
  
  try {
    await api.delete(`/admin/models/${modelId}`)
    await loadModels(currentPage.value)
    showNotification({
      type: 'success',
      message: 'Модель успешно удалена'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка удаления модели')
    })
  }
}

const changePage = (page) => {
  loadModels(page)
}

onMounted(() => {
  loadFilterOptions()
  loadModels()
})
</script>
