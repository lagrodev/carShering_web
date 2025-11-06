<script setup>
import { computed, onMounted, watch } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useCarFilters } from '../composables/useCarFilters'
import { useResponsiveGrid } from '../composables/useResponsiveGrid'
import { useCars } from '../composables/useCars'
import FilterSelect from "../components/FilterSelect.vue"
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Dropdown from '../components/ui/Dropdown.vue'

// Адаптивная сетка
const { cardsPerRow, itemsPerPage } = useResponsiveGrid()

const {
  brandInput, modelInput, classInput,
  brandQuery, modelQuery, classQuery,
  bodyType, minYear, maxYear,
  allBrands, allModels, allClasses, allBodyTypes,
  filteredBrands, filteredModels, filteredClasses,
  loadFilterOptions,
  loadFiltersFromStorage,
  saveFiltersToStorage,
  resetFilters,
  viewCar
} = useCarFilters()

// Загружаем сохранённые фильтры
loadFiltersFromStorage()

// Текущие фильтры
const currentFilters = computed(() => {
  const f = {}
  if (brandInput.value.length) f.brand = brandInput.value.join(',')
  if (modelInput.value.length) f.model = modelInput.value.join(',')
  if (classInput.value.length) f.car_class = classInput.value.join(',')
  if (bodyType.value) f.body_type = bodyType.value
  if (minYear.value !== null) f.minYear = minYear.value
  if (maxYear.value !== null) f.maxYear = maxYear.value
  return f
})

// Сохраняем фильтры при изменении
watch(currentFilters, () => {
  saveFiltersToStorage()
}, { deep: true })

// Машины
const { cars, totalPages, currentPage, loading, goToPage } = useCars(itemsPerPage, currentFilters)

onMounted(() => {
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
      <Card class="mb-8" padding="lg">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Фильтры поиска</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <FilterSelect
            v-model="brandInput"
            v-model:query="brandQuery"
            :options="allBrands"
            label="Бренд"
            placeholder="Введите бренд..."
          />

          <FilterSelect
            v-model="modelInput"
            v-model:query="modelQuery"
            :options="allModels"
            label="Модель"
            placeholder="Введите модель..."
          />

          <FilterSelect
            v-model="classInput"
            v-model:query="classQuery"
            :options="allClasses"
            label="Класс"
            placeholder="Введите класс..."
          />

          <Dropdown
            v-model="bodyType"
            :options="allBodyTypes"
            label="Тип кузова"
          />

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Год от</label>
            <input 
              v-model.number="minYear" 
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
              v-model.number="maxYear" 
              type="number" 
              min="1990" 
              max="2025"
              placeholder="2025"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          
          <Button variant="outline" @click="resetFilters">Сбросить</Button>
        </div>
      </Card>

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
