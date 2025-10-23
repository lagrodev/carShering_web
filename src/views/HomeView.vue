<script setup>
import { computed, onMounted, watch } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useCarFilters } from '../composables/useCarFilters'
import { useResponsiveGrid } from '../composables/useResponsiveGrid'
import { useCars } from '../composables/useCars'
import FilterSelect from "../components/FilterSelect.vue"

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
  saveFiltersToStorage, // ← убедитесь, что он в деструктуризации
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

// 🔑 Сохраняем фильтры при изменении
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
  <div class="home-container">
    <Header/>

    <section class="hero">
      <h1>Car sharing made easy</h1>
      <p>Find and rent cars for daily use</p>
    </section>

    <!-- Фильтры -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
      <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">

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

        <!-- Остальные фильтры (кузов, год) без выпадающих списков -->
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Кузов</label>
          <select v-model="bodyType" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="">Любой</option>
            <option v-for="bt in allBodyTypes" :key="bt" :value="bt">{{ bt }}</option>
          </select>
        </div>

        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Год от</label>
          <input v-model.number="minYear" type="number" min="1990" max="2025"
                 style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;"/>
        </div>

        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Год до</label>
          <input v-model.number="maxYear" type="number" min="1990" max="2025"
                 style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;"/>
        </div>
      </div>

      <!-- Кнопки -->
      <div style="display: flex; gap: 10px;">
        <button
            style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Применить
        </button>
        <button @click="resetFilters"
                style="padding: 8px 16px; background: #e2e8f0; color: #475569; border: none; border-radius: 6px; cursor: pointer;">
          Сбросить
        </button>
      </div>
    </div>

    <!-- Загрузка / Карточки -->
    <section class="cars-section">
      <div v-if="loading" class="loading">Загрузка...</div>
      <div class="cars-grid" :style="{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }">
        <div
            v-for="car in cars"
            :key="car.id"
            class="car-card"
            @click="viewCar(car.id)"
        >
          <div class="car-hover-container">
            <div class="car-image-placeholder"></div>
            <div class="hover-overlay">
              <div class="hover-content">
                <p><strong>Класс:</strong> {{ car.carClass || '—' }}</p>
                <p><strong>Год выпуска:</strong> {{ car.yearOfIssue || '—' }}</p>
                <p><strong>Цена:</strong> {{ car.rent }} ₽/час</p>
              </div>
            </div>
            <div class="car-info">
              <h3>{{ car.brand }} {{ car.model }}</h3>
              <p class="meta">{{ car.yearOfIssue }} • {{ car.carClass }}</p>
              <p class="price">{{ car.rent }} ₽/час</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="pagination">
        <button
            v-for="p in totalPages"
            :key="p"
            @click="goToPage(p - 1)"
            :class="{ active: currentPage === p - 1 }"
        >
          {{ p }}
        </button>
      </div>
    </section>

    <Footer/>
  </div>
</template>

<style src="../assets/styles/car-catalog.css"></style>