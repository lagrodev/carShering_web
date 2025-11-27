// src/composables/useFavorites.js
import { ref } from 'vue'
import api from '../services/api'

export function useFavorites() {
  const favorites = ref([])
  const loading = ref(false)
  const currentPage = ref(0)
  const totalPages = ref(0)
  const totalElements = ref(0)

  const loadFavorites = async (page = 0, size = 20) => {
    loading.value = true
    try {
      const response = await api.get('/cars/favorites', {
        params: { page, size }
      })
      
      if (response.data.content && Array.isArray(response.data.content)) {
        favorites.value = response.data.content
      } else {
        favorites.value = []
      }

      // Парсим пагинацию из вложенного объекта page
      if (response.data.page) {
        currentPage.value = response.data.page.number
        totalPages.value = response.data.page.totalPages
        totalElements.value = response.data.page.totalElements
      } else {
        currentPage.value = 0
        totalPages.value = 1
        totalElements.value = favorites.value.length
      }
    } catch (error) {
      favorites.value = []
      currentPage.value = 0
      totalPages.value = 0
      totalElements.value = 0
    } finally {
      loading.value = false
    }
  }

  const addToFavorites = async (carId) => {
    try {
      await api.post(`/cars/favorites/${carId}`)
      return true
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error)
      return false
    }
  }

  const removeFromFavorites = async (carId) => {
    try {
      await api.delete(`/cars/favorites/${carId}`)
      return true
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error)
      return false
    }
  }

  const isFavorite = async (carId) => {
    try {
      const response = await api.get(`/cars/favorites/${carId}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  const toggleFavorite = async (carId, currentStatus) => {
    if (currentStatus) {
      return await removeFromFavorites(carId)
    } else {
      return await addToFavorites(carId)
    }
  }

  return {
    favorites,
    loading,
    currentPage,
    totalPages,
    totalElements,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  }
}
