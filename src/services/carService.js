// src/services/carService.js
import api from './api'

// Получить уникальные бренды
export const getBrands = () => api.get('/car/models?size=1000').then(r =>
    [...new Set(r.data.content.map(m => m.brand))].sort()
)

// Получить модели по бренду
export const getModelsByBrand = (brand) =>
    api.get('/car/models', { params: { brand, size: 1000 } }).then(r =>
        [...new Set(r.data.content.map(m => m.model))].sort()
    )

// Загрузить каталог
export const getCatalogue = (params) =>
    api.get('/car/catalogue', { params }).then(r => r.data)