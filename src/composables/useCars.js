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
            const params = {
                page,
                size: unref(itemsPerPage),
                sort: 'id',
                ...unref(filterRef)
            }
            const res = await api.get('/car/catalogue', { params })

            cars.value = res.data.content
            totalPages.value = res.data.page.totalPages  // ← было: res.data.totalPages
            currentPage.value = res.data.page.number     // ← лучше брать из ответа
        } catch (e) {
            console.error('Ошибка загрузки машин', e)
            cars.value = []
            totalPages.value = 0
        } finally {
            loading.value = false
        }
    }

    // Загружать при изменении фильтров И сразу при старте
    watch(
        filterRef,
        () => {
            loadCars(0)
        },
        { deep: true, immediate: true } // ← immediate: true вместо отдельного вызова
    )

    const goToPage = (page) => {
        loadCars(page)
    }

    return { cars, totalPages, currentPage, loading, goToPage }
}