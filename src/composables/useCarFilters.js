// useCarFilters.js — ЧИСТАЯ ВЕРСИЯ БЕЗ loadCars

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

export function useCarFilters() {
    const router = useRouter()

    // Фильтры
    const brandInput = ref([])
    const modelInput = ref([])
    const classInput = ref([])
    const brandQuery = ref('')
    const modelQuery = ref('')
    const classQuery = ref('')
    const bodyType = ref('')
    const minYear = ref(null)
    const maxYear = ref(null)

    // Уникальные значения
    const allBrands = ref([])
    const allModels = ref([])
    const allClasses = ref([])
    const allBodyTypes = ref([])

    // Загрузка опций
    const loadFilterOptions = async () => {
        try {
            const [
                brandsRes,
                modelsRes,
                classesRes,
                bodyTypesRes
            ] = await Promise.all([
                api.get('/car/filters/brands'),
                api.get('/car/filters/models'),
                api.get('/car/filters/classes'),
                api.get('/car/filters/body-types')
            ])

            allBrands.value = brandsRes.data.sort()
            allModels.value = modelsRes.data.sort()
            allClasses.value = classesRes.data.sort()
            allBodyTypes.value = bodyTypesRes.data.sort()
        } catch (e) {
            console.error('Не удалось загрузить фильтры', e)
        }
    }

    const filteredBrands = computed(() => {
        const q = brandQuery.value?.toLowerCase()
        return allBrands.value
            .filter(b => !brandInput.value.includes(b)) // исключаем выбранные
            .filter(b => !q || b.toLowerCase().includes(q)) // фильтруем по запросу
    })

    const filteredModels = computed(() => {
        const q = modelQuery.value?.toLowerCase()
        return allModels.value
            .filter(m => !modelInput.value.includes(m))
            .filter(m => !q || m.toLowerCase().includes(q))
    })

    const filteredClasses = computed(() => {
        const q = classQuery.value?.toLowerCase()
        return allClasses.value
            .filter(c => !classInput.value.includes(c))
            .filter(c => !q || c.toLowerCase().includes(q))
    })

    // Сохранение/загрузка
    const saveFiltersToStorage = () => {
        const filters = {
            brand: brandInput.value,

            model: modelInput.value,
            carClass: classInput.value,
            bodyType: bodyType.value,
            minYear: minYear.value,
            maxYear: maxYear.value
        }
        localStorage.setItem('carFilters', JSON.stringify(filters))
    }

    const loadFiltersFromStorage = () => {
        const saved = localStorage.getItem('carFilters')
        if (!saved) return

        const filters = JSON.parse(saved)
        const normalize = (v) => {
            if (!v) return []
            if (Array.isArray(v)) return v
            if (typeof v === 'string') return v.includes(',') ? v.split(',').map(s => s.trim()).filter(Boolean) : [v]
            return []
        }

        brandInput.value = normalize(filters.brand)
        modelInput.value = normalize(filters.model)
        classInput.value = normalize(filters.carClass)
        bodyType.value = filters.bodyType || ''
        minYear.value = filters.minYear || null
        maxYear.value = filters.maxYear || null
    }

    const resetFilters = () => {
        brandInput.value = []
        modelInput.value = []
        classInput.value = []
        bodyType.value = ''
        minYear.value = null
        maxYear.value = null
        localStorage.removeItem('carFilters')
    }

    const viewCar = (id) => router.push(`/car/${id}`)

    return {
        brandInput, modelInput, classInput,
        brandQuery, modelQuery, classQuery,
        bodyType, minYear, maxYear,
        allBrands, allModels, allClasses, allBodyTypes,
        filteredBrands, filteredModels, filteredClasses,
        loadFilterOptions,
        saveFiltersToStorage,
        loadFiltersFromStorage,
        resetFilters,
        viewCar
    }
}