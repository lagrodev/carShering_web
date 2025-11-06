<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Управление справочниками</h2>

    <!-- Tabs for different filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Brands -->
      <div class="border border-gray-200 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Марки</h3>
          <button
            @click="openAddModal('brand')"
            class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            title="Добавить марку"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(brand, index) in brands"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-gray-900">{{ brand }}</span>
          </div>
          <div v-if="brands.length === 0" class="text-center py-8 text-gray-500">
            Нет марок
          </div>
        </div>
      </div>

      <!-- Model Names -->
      <div class="border border-gray-200 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Названия моделей</h3>
          <button
            @click="openAddModal('model')"
            class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            title="Добавить название"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(modelName, index) in modelNames"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-gray-900">{{ modelName }}</span>
          </div>
          <div v-if="modelNames.length === 0" class="text-center py-8 text-gray-500">
            Нет названий
          </div>
        </div>
      </div>

      <!-- Car Classes -->
      <div class="border border-gray-200 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Классы</h3>
          <button
            @click="openAddModal('class')"
            class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            title="Добавить класс"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(carClass, index) in carClasses"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-gray-900">{{ carClass }}</span>
          </div>
          <div v-if="carClasses.length === 0" class="text-center py-8 text-gray-500">
            Нет классов
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <Transition name="modal-fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h3 class="text-xl font-bold text-gray-900">
              Добавить {{ modalTitle }}
            </h3>
            <button
              @click="closeAddModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleAdd" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Название <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Введите название"
              />
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {{ error }}
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="closeAddModal"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
              >
                {{ saving ? 'Добавление...' : 'Добавить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import api from '../../services/api'

const brands = ref([])
const modelNames = ref([])
const carClasses = ref([])
const showAddModal = ref(false)
const currentType = ref('')
const newName = ref('')
const saving = ref(false)
const error = ref('')

const modalTitle = computed(() => {
  switch (currentType.value) {
    case 'brand': return 'марку'
    case 'model': return 'название модели'
    case 'class': return 'класс'
    default: return ''
  }
})

const loadFilters = async () => {
  try {
    // Load all filters from separate endpoints
    const [brandsRes, modelsRes, classesRes] = await Promise.all([
      api.get('/car/filters/brands'),
      api.get('/car/filters/models'),
      api.get('/car/filters/classes')
    ])
    brands.value = brandsRes.data || []
    modelNames.value = modelsRes.data || []
    carClasses.value = classesRes.data || []
  } catch (err) {
    console.error('Error loading filters:', err)
  }
}

const openAddModal = (type) => {
  currentType.value = type
  showAddModal.value = true
  newName.value = ''
  error.value = ''
}

const closeAddModal = () => {
  showAddModal.value = false
  currentType.value = ''
  newName.value = ''
  error.value = ''
}

const handleAdd = async () => {
  saving.value = true
  error.value = ''

  try {
    let endpoint = ''
    switch (currentType.value) {
      case 'brand':
        endpoint = '/admin/filters/brands'
        break
      case 'model':
        endpoint = '/admin/filters/models'
        break
      case 'class':
        endpoint = '/admin/filters/classes'
        break
    }

    await api.post(endpoint, { name: newName.value })
    await loadFilters()
    closeAddModal()
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка добавления')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadFilters()
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
