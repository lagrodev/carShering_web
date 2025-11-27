<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useCarFilters } from '../composables/useCarFilters'
import { useResponsiveGrid } from '../composables/useResponsiveGrid'
import { useCars } from '../composables/useCars'
import { useFavorites } from '../composables/useFavorites'
import { useAuth } from '../composables/useAuth'
import FilterSelect from "../components/FilterSelect.vue"
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Dropdown from '../components/ui/Dropdown.vue'

// Избранное
const { toggleFavorite } = useFavorites()
const { isAuthenticated } = useAuth()

// Функция для переключения избранного
const handleToggleFavorite = async (car, event) => {
  event.stopPropagation() // Предотвращаем переход на детальную страницу
  
  if (!isAuthenticated.value) {
    return // Если не авторизован, ничего не делаем
  }

  const currentState = car.favorite || false
  const success = await toggleFavorite(car.id, currentState)
  
  if (success) {
    // Обновляем состояние в объекте автомобиля
    car.favorite = !currentState
  }
}


// Адаптивная сетка
const { cardsPerRow, itemsPerPage } = useResponsiveGrid()

const {
  brandInput, modelInput, classInput,
  brandQuery, modelQuery, classQuery,
  bodyType, minYear, maxYear,
  dateStart, dateEnd, minCell, maxCell,
  allBrands, allModels, allClasses, allBodyTypes,
  minMaxCell,
  filteredBrands, filteredModels, filteredClasses,
  loadFilterOptions,
  loadMinMaxCell,
  loadFiltersFromStorage,
  saveFiltersToStorage,
  resetFilters,
  viewCar
} = useCarFilters()

// Загружаем сохранённые фильтры
loadFiltersFromStorage()

// Текущие фильтры (только значимые значения)
const currentFilters = computed(() => {
  const f = {}
  if (brandInput.value.length) f.brand = brandInput.value.join(',')
  if (modelInput.value.length) f.model = modelInput.value.join(',')
  if (classInput.value.length) f.car_class = classInput.value.join(',')
  if (bodyType.value) f.body_type = bodyType.value
  if (minYear.value !== null && minYear.value !== '') f.minYear = minYear.value
  if (maxYear.value !== null && maxYear.value !== '') f.maxYear = maxYear.value
  if (dateStart.value) f.date_start = dateStart.value
  if (dateEnd.value) f.date_end = dateEnd.value
  // Только добавляем цены если они реально заданы пользователем
  if (minCell.value !== null && minCell.value !== '' && minCell.value > 0) {
    f.min_cell = minCell.value
  }
  if (maxCell.value !== null && maxCell.value !== '' && maxCell.value < 999999) {
    f.max_cell = maxCell.value
  }
  
  return f
})

// Валидация цен
watch(minCell, (newVal) => {
  if (newVal !== null && newVal !== '') {
    // Не может быть меньше минимума из API
    if (newVal < minMaxCell.value.min) {
      minCell.value = minMaxCell.value.min
    }
    // Не может быть больше максимальной цены
    if (maxCell.value !== null && newVal > maxCell.value) {
      minCell.value = maxCell.value
    }
    // Не может быть отрицательной
    if (newVal < 0) {
      minCell.value = 0
    }
  }
})

watch(maxCell, (newVal) => {
  if (newVal !== null && newVal !== '') {
    // Не может быть больше максимума из API
    if (newVal > minMaxCell.value.max) {
      maxCell.value = minMaxCell.value.max
    }
    // Не может быть меньше минимальной цены
    if (minCell.value !== null && newVal < minCell.value) {
      maxCell.value = minCell.value
    }
    // Не может быть отрицательной
    if (newVal < 0) {
      maxCell.value = 0
    }
  }
})

// Сохраняем фильтры при изменении
watch(currentFilters, () => {
  saveFiltersToStorage()
}, { deep: true })

// Машины
const { cars, totalPages, currentPage, loading, goToPage } = useCars(itemsPerPage, currentFilters)

onMounted(() => {
  console.log('🚀 [HomeView] Component mounted')
  loadFilterOptions()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header/>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Каршеринг стал проще</h1>
        <p class="text-xl text-primary-100">Найдите и арендуйте автомобиль для повседневного использования</p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 500px;">
      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
        <!-- Filter Header -->
        <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Фильтры поиска
          </h2>
        </div>

        <div class="p-6">
          <!-- Main Filters Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <FilterSelect
              v-model="brandInput"
              v-model:query="brandQuery"
              :options="allBrands"
              label="Бренд"
              placeholder="Выберите бренд..."
            />

            <FilterSelect
              v-model="modelInput"
              v-model:query="modelQuery"
              :options="allModels"
              label="Модель"
              placeholder="Выберите модель..."
            />

            <FilterSelect
              v-model="classInput"
              v-model:query="classQuery"
              :options="allClasses"
              label="Класс"
              placeholder="Выберите класс..."
            />

            <Dropdown
              v-model="bodyType"
              :options="allBodyTypes"
              label="Тип кузова"
            />

            <!-- Year Range -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Год выпуска
              </label>
              <div class="grid grid-cols-2 gap-3">
                <input 
                  v-model.number="minYear" 
                  type="number" 
                  min="1990" 
                  :max="new Date().getFullYear()"
                  placeholder="От"
                  class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <input 
                  v-model.number="maxYear" 
                  type="number" 
                  min="1990" 
                  :max="new Date().getFullYear()"
                  placeholder="До"
                  class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <!-- Date Range -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Период аренды
              </label>
              <div class="space-y-3">
                <div class="relative">
                  <label class="text-xs text-gray-600 mb-1 block">Начало аренды</label>
                  <input 
                    v-model="dateStart" 
                    type="datetime-local" 
                    :min="new Date().toISOString().slice(0, 16)"
                    class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-700"
                  />
                  <svg class="w-5 h-5 text-gray-400 absolute left-3 top-9 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="relative">
                  <label class="text-xs text-gray-600 mb-1 block">Окончание аренды</label>
                  <input 
                    v-model="dateEnd" 
                    type="datetime-local" 
                    :min="dateStart || new Date().toISOString().slice(0, 16)"
                    class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-700"
                  />
                  <svg class="w-5 h-5 text-gray-400 absolute left-3 top-9 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Range Slider -->
          <div class="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-primary-100">
            <label class="block text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Цена за день
              </span>
              <span class="text-primary-600 font-bold text-lg">
                {{ (minCell || minMaxCell.min).toLocaleString() }} — {{ (maxCell || minMaxCell.max).toLocaleString() }} ₽
              </span>
            </label>
            
            <div class="space-y-6">
              <!-- Price Inputs -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-2 block flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Минимальная цена
                  </label>
                  <div class="relative">
                    <input 
                      v-model.number="minCell" 
                      type="number" 
                      :min="minMaxCell.min"
                      :max="maxCell || minMaxCell.max"
                      :step="100"
                      placeholder="От"
                      class="w-full pl-3 pr-8 py-3 border-2 border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-semibold text-primary-700 bg-white"
                    />
                    <span class="absolute right-3 top-3 text-gray-400 text-sm font-normal">₽</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Мин: {{ minMaxCell.min.toLocaleString() }} ₽</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-2 block flex items-center justify-end gap-1">
                    Максимальная цена
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </label>
                  <div class="relative">
                    <input 
                      v-model.number="maxCell" 
                      type="number" 
                      :min="minCell || minMaxCell.min"
                      :max="minMaxCell.max"
                      :step="100"
                      placeholder="До"
                      class="w-full pl-3 pr-8 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-semibold text-purple-700 bg-white"
                    />
                    <span class="absolute right-3 top-3 text-gray-400 text-sm font-normal">₽</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 text-right">Макс: {{ minMaxCell.max.toLocaleString() }} ₽</p>
                </div>
              </div>
              
              <!-- Visual Range Bar -->
              <div class="relative pt-2">
                <div class="h-3 bg-gray-200 rounded-full relative overflow-hidden">
                  <div 
                    class="absolute h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
                    :style="{
                      left: `${((minCell || minMaxCell.min) - minMaxCell.min) / (minMaxCell.max - minMaxCell.min) * 100}%`,
                      width: `${((maxCell || minMaxCell.max) - (minCell || minMaxCell.min)) / (minMaxCell.max - minMaxCell.min) * 100}%`
                    }"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{{ minMaxCell.min.toLocaleString() }} ₽</span>
                  <span>{{ minMaxCell.max.toLocaleString() }} ₽</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <Button 
              variant="outline" 
              @click="resetFilters"
              class="flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center" style="min-height: 400px;">
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
        v-else
        class="grid gap-6"
        style="min-height: 400px;"
        :class="{
          'grid-cols-1': cardsPerRow === 1,
          'grid-cols-1 md:grid-cols-2': cardsPerRow === 2,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': cardsPerRow === 3,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': cardsPerRow === 4
        }"
      >
        <Card
          v-for="car in cars"
          :key="car.id"
          class="cursor-pointer overflow-hidden group"
          @click="viewCar(car.id)"
          padding="none"
        >
          <!-- Image Section -->
          <div class="relative overflow-hidden bg-gray-100 aspect-video">
            <img
              src="../assets/images/blue-car.png"
              :alt="`${car.brand} ${car.model}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            <!-- Favorite Button (Heart Icon) -->
            <button
              v-if="isAuthenticated"
              @click="handleToggleFavorite(car, $event)"
              class="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-10"
              :class="{ 'animate-pulse': car.favorite }"
            >
              <svg 
                class="w-5 h-5 transition-all duration-200" 
                :class="car.favorite ? 'text-red-500 fill-current' : 'text-gray-400'"
                fill="none" 
                :fill="car.favorite ? 'currentColor' : 'none'"
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div class="text-white space-y-1">
                <p class="text-sm"><span class="font-semibold">Класс:</span> {{ car.carClass || '—' }}</p>
                <p class="text-sm"><span class="font-semibold">Год:</span> {{ car.yearOfIssue || '—' }}</p>
                <p class="text-sm"><span class="font-semibold">Цена:</span> {{ car.rent }} ₽/месяц</p>
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
            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
              <span class="text-2xl font-bold text-primary-600">{{ car.rent }} ₽</span>
              <span class="text-sm text-gray-500">/час</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && cars.length === 0" class="text-center flex items-center justify-center" style="min-height: 400px;">
        <div>
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Автомобили не найдены</h3>
          <p class="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации</p>
          <Button variant="primary" @click="resetFilters">Сбросить фильтры</Button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && !loading" class="flex flex-wrap justify-center gap-2 mt-6">
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
    </main>

    <Footer/>
  </div>
</template>
