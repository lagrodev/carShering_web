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
    const dateStart = ref('')
    const dateEnd = ref('')
    const minCell = ref(null)
    const maxCell = ref(null)

    // Уникальные значения
    const allBrands = ref([])
    const allModels = ref([])
    const allClasses = ref([])
    const allBodyTypes = ref([])
    const minMaxCell = ref({ min: 0, max: 100000 })

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
            
            // Загружаем min/max цены
            await loadMinMaxCell()
        } catch (e) {
            console.error('Не удалось загрузить фильтры', e)
        }
    }

    // Загрузка min/max цены с учетом текущих фильтров
    const loadMinMaxCell = async () => {
        try {
            const params = {}
            if (brandInput.value.length) params.brand = brandInput.value.join(',')
            if (modelInput.value.length) params.model = modelInput.value.join(',')
            if (classInput.value.length) params.car_class = classInput.value.join(',')
            if (bodyType.value) params.body_type = bodyType.value
            if (minYear.value) params.minYear = minYear.value
            if (maxYear.value) params.maxYear = maxYear.value
            if (dateStart.value) params.date_start = dateStart.value
            if (dateEnd.value) params.date_end = dateEnd.value

            const res = await api.get('/car/filters/min-max-cell', { params })
            minMaxCell.value = res.data
        } catch (e) {
            console.error('Не удалось загрузить диапазон цен', e)
            minMaxCell.value = { min: 0, max: 100000 }
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
            maxYear: maxYear.value,
            dateStart: dateStart.value,
            dateEnd: dateEnd.value,
            minCell: minCell.value,
            maxCell: maxCell.value
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
        dateStart.value = filters.dateStart || ''
        dateEnd.value = filters.dateEnd || ''
        minCell.value = filters.minCell || null
        maxCell.value = filters.maxCell || null
    }

    const resetFilters = () => {
        brandInput.value = []
        modelInput.value = []
        classInput.value = []
        bodyType.value = ''
        minYear.value = null
        maxYear.value = null
        dateStart.value = ''
        dateEnd.value = ''
        minCell.value = null
        maxCell.value = null
        localStorage.removeItem('carFilters')
    }

    const viewCar = (id) => router.push(`/car/${id}`)

    return {
        brandInput, modelInput, classInput,
        brandQuery, modelQuery, classQuery,
        bodyType, minYear, maxYear,
        dateStart, dateEnd, minCell, maxCell,
        allBrands, allModels, allClasses, allBodyTypes,
        minMaxCell,
        filteredBrands, filteredModels, filteredClasses,
        loadFilterOptions,
        loadMinMaxCell,
        saveFiltersToStorage,
        loadFiltersFromStorage,
        resetFilters,
        viewCar
    }
}