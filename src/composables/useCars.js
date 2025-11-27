// src/composables/useCars.js
import { ref, unref, watch } from 'vue'
import api from '../services/api'

export function useCars(itemsPerPage, filterRef) {
    const cars = ref([])
    const totalPages = ref(0)
    const currentPage = ref(0)
    const loading = ref(false)

    const loadCars = async (page) => {
        loading.value = true
        try {
            const filters = unref(filterRef)
            const params = {
                page,
                size: unref(itemsPerPage),
                ...filters
            }
            
            const res = await api.get('/car/catalogue', { params })
            
            // Парсим новую структуру с вложенным page объектом
            if (res.data.content && Array.isArray(res.data.content)) {
                cars.value = res.data.content
                // Проверяем новую структуру с page объектом
                if (res.data.page) {
                    totalPages.value = res.data.page.totalPages || 0
                    currentPage.value = res.data.page.number || 0
                } else {
                    // Старая структура (прямо на верхнем уровне)
                    totalPages.value = res.data.totalPages || 0
                    currentPage.value = res.data.number || 0
                }
            } else {
                cars.value = []
                totalPages.value = 0
            }
        } catch (e) {
            cars.value = []
            totalPages.value = 0
        } finally {
            loading.value = false
        }
    }

    // Загружать при изменении фильтров (без immediate, чтобы не было двойной загрузки)
    watch(
        filterRef,
        () => {
            loadCars(0)
        },
        { deep: true }
    )

    // Первая загрузка
    loadCars(0)

    const goToPage = (page) => {
        loadCars(page)
    }

    return { cars, totalPages, currentPage, loading, goToPage }
}