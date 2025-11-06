<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Управление автомобилями</h2>
      <Button variant="primary" @click="router.push('/admin/cars/new')">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Добавить автомобиль
      </Button>
    </div>

    <!-- Filters -->
    <Card class="mb-6" padding="lg">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Фильтры поиска</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <FilterSelect
          v-model="filters.brandInput"
          v-model:query="filters.brandQuery"
          :options="allBrands"
          label="Бренд"
          placeholder="Введите бренд..."
        />

        <FilterSelect
          v-model="filters.modelInput"
          v-model:query="filters.modelQuery"
          :options="allModelNames"
          label="Модель"
          placeholder="Введите модель..."
        />

        <FilterSelect
          v-model="filters.classInput"
          v-model:query="filters.classQuery"
          :options="allClasses"
          label="Класс"
          placeholder="Введите класс..."
        />

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Тип кузова</label>
          <select
            v-model="filters.bodyType"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Все типы</option>
            <option v-for="type in allBodyTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Статус</label>
          <select
            v-model="filters.carState"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Все статусы</option>
            <option v-for="state in allCarStates" :key="state" :value="state">{{ translateState(state) }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Год от</label>
          <input 
            v-model.number="filters.minYear" 
            type="number" 
            min="1990" 
            max="2025"
            placeholder="1990"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Год до</label>
          <input 
            v-model.number="filters.maxYear" 
            type="number" 
            min="1990" 
            max="2025"
            placeholder="2025"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <Button variant="outline" @click="resetFilters">Сбросить</Button>
      </div>
    </Card>

    <!-- Content Card -->
    <Card padding="none">
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600">Загрузка автомобилей...</p>
          </div>
        </div>

        <!-- Cars Grid -->
        <div 
          v-else-if="cars.length > 0" 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
      <Card
        v-for="car in cars"
        :key="car.id"
        class="cursor-pointer overflow-hidden group"
        padding="none"
        @click="viewCar(car.id)"
      >
        <!-- Image Section -->
        <div class="relative overflow-hidden bg-gray-100 aspect-video">
          <img
            src="../../assets/images/blue-car.png"
            :alt="`${car.brand} ${car.model}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <div class="text-white space-y-1">
              <p v-if="car.gosNumber" class="text-sm"><span class="font-semibold">Гос. номер:</span> {{ car.gosNumber }}</p>
              <p v-if="car.vin" class="text-sm"><span class="font-semibold">VIN:</span> {{ car.vin }}</p>
              <p class="text-sm"><span class="font-semibold">Класс:</span> {{ car.carClass || '—' }}</p>
              <p class="text-sm"><span class="font-semibold">Год:</span> {{ car.yearOfIssue || '—' }}</p>
              <p v-if="car.status" class="text-sm"><span class="font-semibold">Статус:</span> {{ translateState(car.status) }}</p>
              <p class="text-sm"><span class="font-semibold">Цена:</span> {{ car.rent }} ₽/день</p>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {{ car.brand }} {{ car.model }}
          </h3>
          
          <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ car.yearOfIssue }}
            </span>
            <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {{ car.carClass }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="car.bodyType" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
              {{ car.bodyType }}
            </span>
            <span v-if="car.status" :class="getStateClass(car.status)" class="px-2 py-1 text-xs font-medium rounded-lg">
              {{ translateState(car.status) }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <span class="text-2xl font-bold text-primary-600">{{ car.rent }} ₽</span>
            <span class="text-sm text-gray-500">/день</span>
          </div>
        </div>
      </Card>
    </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="text-center flex items-center justify-center py-20">
          <div>
            <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Автомобили не найдены</h3>
            <p class="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации</p>
            <Button variant="primary" @click="resetFilters">Сбросить фильтры</Button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && !loading" class="px-6 py-4 border-t border-gray-200">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="p in totalPages"
            :key="p"
            @click="goToPage(p - 1)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm',
              currentPage === p - 1
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '../../utils/errorHandler'
import { useNotification } from '../../composables/useNotification'
import api from '../../services/api'
import Card from '../ui/Card.vue'
import FilterSelect from '../FilterSelect.vue'
import Button from '../ui/Button.vue'

const router = useRouter()
const { showNotification } = useNotification()

const cars = ref([])
const loading = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)

const allBodyTypes = ref([])
const allClasses = ref([])
const allCarStates = ref([])
const allBrands = ref([])
const allModelNames = ref([])

const filters = ref({
  brandInput: [],
  brandQuery: '',
  modelInput: [],
  modelQuery: '',
  classInput: [],
  classQuery: '',
  bodyType: '',
  carState: '',
  minYear: null,
  maxYear: null
})

const loadFilterOptions = async () => {
  try {
    const [bodyTypesRes, classesRes, statesRes, brandsRes, modelsRes] = await Promise.all([
      api.get('/car/filters/body-types'),
      api.get('/car/filters/classes'),
      api.get('/admin/cars/state'),
      api.get('/car/filters/brands'),
      api.get('/car/filters/models')
    ])
    allBodyTypes.value = bodyTypesRes.data
    allClasses.value = classesRes.data
    // Состояния приходят как массив объектов {id, status}, извлекаем только status
    allCarStates.value = statesRes.data.map(state => state.status)
    allBrands.value = brandsRes.data
    allModelNames.value = modelsRes.data
  } catch (error) {
    console.error('Не удалось загрузить опции фильтров:', error)
  }
}

const loadCars = async (page = 0) => {
  loading.value = true
  try {
    const params = {
      page,
      size: 20,
      detailed: true // Запрашиваем полную информацию для админа
    }
    
    if (filters.value.brandInput.length) {
      params.brand = filters.value.brandInput.join(',')
    }
    if (filters.value.modelInput.length) {
      params.model = filters.value.modelInput.join(',')
    }
    if (filters.value.classInput.length) {
      params.car_class = filters.value.classInput.join(',')
    }
    if (filters.value.bodyType) {
      params.body_type = filters.value.bodyType
    }
    if (filters.value.carState) {
      params.car_state = filters.value.carState
    }
    if (filters.value.minYear !== null) {
      params.minYear = filters.value.minYear
    }
    if (filters.value.maxYear !== null) {
      params.maxYear = filters.value.maxYear
    }
    
    const response = await api.get('/admin/cars', { params })
    
    console.log('RAW RESPONSE от /admin/cars:', response.data)
    console.log('Первая машина (если есть):', response.data.content?.[0])
    
    // Backend возвращает формат: { content: [...], page: { size, number, totalElements, totalPages } }
    cars.value = response.data.content || []
    currentPage.value = response.data.page?.number || 0
    totalPages.value = response.data.page?.totalPages || 0
    
    console.log('Загружено машин:', cars.value.length, 'Страниц:', totalPages.value)
    console.log('Пример машины после обработки:', cars.value[0])
  } catch (error) {
    console.error('Error loading cars:', error)
    cars.value = []
    totalPages.value = 0
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки автомобилей')
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    brandInput: [],
    brandQuery: '',
    modelInput: [],
    modelQuery: '',
    classInput: [],
    classQuery: '',
    bodyType: '',
    carState: '',
    minYear: null,
    maxYear: null
  }
  loadCars()
}

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
    'AVAILABLE': 'bg-green-100 text-green-800',
    'UNAVAILABLE': 'bg-gray-100 text-gray-700',
    'IN_USE': 'bg-blue-100 text-blue-700',
    'MAINTENANCE': 'bg-yellow-100 text-yellow-800',
    'RESERVED': 'bg-purple-100 text-purple-700',
    'CLOSED': 'bg-red-100 text-red-800'
  }
  return classes[state] || 'bg-gray-100 text-gray-700'
}

const viewCar = (carId) => {
  router.push({ name: 'AdminCarDetails', params: { id: carId } })
}

const goToPage = (page) => {
  loadCars(page)
}

// Автоматическая перезагрузка при изменении фильтров
watch(filters, () => {
  loadCars(0) // Сброс на первую страницу при изменении фильтров
}, { deep: true })

onMounted(() => {
  loadFilterOptions()
  loadCars()
})
</script>
