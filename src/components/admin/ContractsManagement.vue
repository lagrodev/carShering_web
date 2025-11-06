<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Управление контрактами</h2>
    </div>

    <!-- Filters -->
    <Card class="mb-6" padding="lg">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Фильтры поиска</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Статус</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Все статусы</option>
            <option value="ACTIVE">Активный</option>
            <option value="PENDING">В ожидании</option>
            <option value="COMPLETED">Завершен</option>
            <option value="CANCELLED">Отменен</option>
            <option value="CANCELLATION_REQUESTED">Запрошена отмена</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">ID Пользователя</label>
          <input
            v-model.number="filters.idUser"
            type="number"
            placeholder="Введите ID"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">ID Автомобиля</label>
          <input
            v-model.number="filters.idCar"
            type="number"
            placeholder="Введите ID"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Бренд</label>
          <input
            v-model="filters.brand"
            type="text"
            placeholder="Введите бренд"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Тип кузова</label>
          <select
            v-model="filters.bodyType"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Все типы</option>
            <option v-for="type in allBodyTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Класс</label>
          <select
            v-model="filters.carClass"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Все классы</option>
            <option v-for="cls in allClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3">
        <Button variant="primary" @click="loadContracts()">Применить фильтры</Button>
        <Button variant="outline" @click="resetFilters">Сбросить</Button>
      </div>
    </Card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка контрактов...</p>
      </div>
    </div>

    <!-- Contracts List -->
    <div v-else-if="contracts.length > 0" class="space-y-4">
      <Card 
        v-for="contract in contracts" 
        :key="contract.id"
        class="cursor-pointer hover:shadow-lg transition-all"
        padding="lg"
        @click="viewContract(contract.id)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 space-y-3">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900">
                  {{ contract.brand }} {{ contract.model }}
                </h3>
                <p class="text-sm text-gray-600">Контракт #{{ contract.id }}</p>
              </div>
              <span :class="getStatusClass(contract.state)" class="px-3 py-1 text-xs font-semibold rounded-full">
                {{ translateStatus(contract.state) }}
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Клиент</p>
                <p class="text-sm font-semibold text-gray-900">{{ contract.lastName }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">VIN</p>
                <p class="text-sm font-semibold text-gray-900">{{ contract.vin }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Гос. номер</p>
                <p class="text-sm font-semibold text-gray-900">{{ contract.gosNumber }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Стоимость</p>
                <p class="text-sm font-semibold text-primary-600">{{ contract.totalCost }} ₽</p>
              </div>
            </div>

            <!-- Dates -->
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(contract.startDate) }} — {{ formatDate(contract.endDate) }}
              </span>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {{ contract.carClass }}
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {{ contract.bodyType }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 pt-2" @click.stop>
              <button
                v-if="contract.state === 'PENDING'"
                @click="confirmContract(contract.id)"
                class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Подтвердить
              </button>
              <button
                v-if="contract.state === 'CANCELLATION_REQUESTED'"
                @click="confirmCancellation(contract.id)"
                class="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Подтвердить отмену
              </button>
              <button
                v-if="contract.state === 'ACTIVE' || contract.state === 'PENDING'"
                @click="cancelContract(contract.id)"
                class="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Отменить
              </button>
            </div>
          </div>
        </div>
      </Card>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-wrap justify-center gap-2 pt-4">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="goToPage(p - 1)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all text-sm',
            currentPage === p - 1
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Контракты не найдены</h3>
      <p class="text-gray-600">Попробуйте изменить параметры фильтрации</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '../../utils/errorHandler'
import { useNotification } from '../../composables/useNotification'
import api from '../../services/api'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'

const router = useRouter()
const { showNotification, showConfirm } = useNotification()

const contracts = ref([])
const loading = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)

const allBodyTypes = ref([])
const allClasses = ref([])

const filters = ref({
  status: '',
  idUser: null,
  idCar: null,
  brand: '',
  bodyType: '',
  carClass: ''
})

const loadFilterOptions = async () => {
  try {
    const [bodyTypesRes, classesRes] = await Promise.all([
      api.get('/car/filters/body-types'),
      api.get('/car/filters/classes')
    ])
    allBodyTypes.value = bodyTypesRes.data
    allClasses.value = classesRes.data
  } catch (error) {
    console.error('Не удалось загрузить опции фильтров:', error)
  }
}

const loadContracts = async (page = 0) => {
  loading.value = true
  try {
    const params = {
      page,
      size: 20
    }
    
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.idUser) params.idUser = filters.value.idUser
    if (filters.value.idCar) params.idCar = filters.value.idCar
    if (filters.value.brand) params.brand = filters.value.brand
    if (filters.value.bodyType) params.body_type = filters.value.bodyType
    if (filters.value.carClass) params.car_class = filters.value.carClass
    
    const response = await api.get('/admin/contracts', { params })
    contracts.value = response.data.content || []
    currentPage.value = response.data.page?.number || 0
    totalPages.value = response.data.page?.totalPages || 0
  } catch (error) {
    console.error('Error loading contracts:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки контрактов')
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    status: '',
    idUser: null,
    idCar: null,
    brand: '',
    bodyType: '',
    carClass: ''
  }
  loadContracts()
}

const translateStatus = (status) => {
  const translations = {
    'ACTIVE': 'Активный',
    'PENDING': 'В ожидании',
    'COMPLETED': 'Завершен',
    'CANCELLED': 'Отменен',
    'CANCELLATION_REQUESTED': 'Запрошена отмена'
  }
  return translations[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-blue-100 text-blue-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'CANCELLATION_REQUESTED': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const viewContract = (contractId) => {
  router.push({ name: 'AdminContractDetails', params: { id: contractId } })
}

const confirmContract = async (contractId) => {
  const confirmed = await showConfirm({
    type: 'info',
    title: 'Подтверждение контракта',
    message: 'Вы уверены, что хотите подтвердить этот контракт? Контракт станет активным.'
  })
  
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/contracts/${contractId}/confirm`)
    await loadContracts(currentPage.value)
    showNotification({
      type: 'success',
      message: 'Контракт успешно подтвержден'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка подтверждения контракта')
    })
  }
}

const cancelContract = async (contractId) => {
  const confirmed = await showConfirm({
    type: 'error',
    title: 'Отмена контракта',
    message: 'Вы уверены, что хотите отменить этот контракт? Это действие необратимо.'
  })
  
  if (!confirmed) return
  
  try {
    await api.delete(`/admin/contracts/${contractId}/cancel`)
    await loadContracts(currentPage.value)
    showNotification({
      type: 'success',
      message: 'Контракт успешно отменен'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка отмены контракта')
    })
  }
}

const confirmCancellation = async (contractId) => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение отмены',
    message: 'Вы уверены, что хотите подтвердить запрос на отмену этого контракта?'
  })
  
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/contracts/contracts/${contractId}/confirm-cancellation`)
    await loadContracts(currentPage.value)
    showNotification({
      type: 'success',
      message: 'Отмена контракта подтверждена'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка подтверждения отмены')
    })
  }
}

const goToPage = (page) => {
  loadContracts(page)
}

onMounted(() => {
  loadFilterOptions()
  loadContracts()
})
</script>
