<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-10">
        <div class="relative overflow-hidden bg-gradient-to-r from-red-50 via-pink-50 to-red-50 rounded-2xl p-8 shadow-sm border border-red-100">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative group">
                <div class="absolute inset-0 bg-red-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div class="relative bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-pink-900 bg-clip-text text-transparent">
                  Избранные автомобили
                </h1>
                <p class="text-gray-600 mt-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span v-if="totalElements > 0">
                    Ваша коллекция любимых автомобилей — {{ totalElements }} {{ totalElements === 1 ? 'автомобиль' : totalElements < 5 ? 'автомобиля' : 'автомобилей' }}
                  </span>
                  <span v-else>Начните собирать вашу коллекцию любимых автомобилей</span>
                </p>
              </div>
            </div>
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
          <p class="text-gray-600">Загрузка избранных автомобилей...</p>
        </div>
      </div>

      <!-- Cars Grid -->
      <div v-else-if="favorites.length > 0">
        <div 
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
            v-for="car in favorites"
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
              
              <!-- Favorite Button (Always filled since it's favorites page) -->
              <button
                @click="handleRemoveFavorite(car.id, $event)"
                class="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              >
                <svg 
                  class="w-5 h-5 text-red-500 fill-current transition-all duration-200" 
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div class="text-white space-y-1">
                  <p class="text-sm"><span class="font-semibold">Класс:</span> {{ car.carClass || '—' }}</p>
                  <p class="text-sm"><span class="font-semibold">Год:</span> {{ car.yearOfIssue || '—' }}</p>
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
              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <span class="text-2xl font-bold text-primary-600">{{ car.rent }} ₽</span>
                <span class="text-sm text-gray-500">/день</span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <div class="inline-flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
            <!-- Previous Button -->
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 0"
              class="px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === 0 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-primary-600 bg-white hover:bg-primary-50 hover:text-primary-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="handlePageChange(page - 1)"
                class="min-w-[40px] px-3 py-2 rounded-md font-medium transition-all duration-200"
                :class="currentPage === page - 1
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 bg-white hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage >= totalPages - 1"
              class="px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage >= totalPages - 1
                ? 'text-gray-400 bg-gray-100'
                : 'text-primary-600 bg-white hover:bg-primary-50 hover:text-primary-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center flex items-center justify-center" style="min-height: 400px;">
        <div class="max-w-md">
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50"></div>
            </div>
            <svg class="w-32 h-32 text-gray-300 mx-auto relative" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">У вас пока нет избранных автомобилей</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">
            Находите понравившиеся автомобили и добавляйте их в избранное, нажимая на иконку сердечка. 
            Все избранные машины будут сохранены здесь для быстрого доступа.
          </p>
          <Button variant="primary" @click="goToCatalog" class="group">
            <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Перейти к каталогу автомобилей
          </Button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useFavorites } from '../composables/useFavorites'
import { useResponsiveGrid } from '../composables/useResponsiveGrid'

const router = useRouter()
const { favorites, loading, currentPage, totalPages, totalElements, loadFavorites, removeFromFavorites } = useFavorites()
const { cardsPerRow } = useResponsiveGrid()

const viewCar = (carId) => {
  router.push({ name: 'CarDetails', params: { id: carId } })
}

const handleRemoveFavorite = async (carId, event) => {
  event.stopPropagation()
  const success = await removeFromFavorites(carId)
  if (success) {
    // Обновляем список избранного
    await loadFavorites(currentPage.value)
  }
}

const handlePageChange = (page) => {
  loadFavorites(page)
}

const goToCatalog = () => {
  router.push({ name: 'Home' })
}

onMounted(() => {
  loadFavorites()
})
</script>
