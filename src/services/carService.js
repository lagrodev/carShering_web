// src/services/carService.js
import api from './api'

/**
 * Получить список брендов для фильтров
 * @returns {Promise<string[]>}
 */
export const getBrands = () => 
    api.get('/car/filters/brands').then(r => r.data)

/**
 * Получить список моделей для фильтров
 * @returns {Promise<string[]>}
 */
export const getModels = () => 
    api.get('/car/filters/models').then(r => r.data)

/**
 * Получить список классов для фильтров
 * @returns {Promise<string[]>}
 */
export const getClasses = () => 
    api.get('/car/filters/classes').then(r => r.data)

/**
 * Получить список типов кузова для фильтров
 * @returns {Promise<string[]>}
 */
export const getBodyTypes = () => 
    api.get('/car/filters/body-types').then(r => r.data)

/**
 * Получить каталог автомобилей с фильтрацией
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getCatalogue = (params) =>
    api.get('/car/catalogue', { params }).then(r => r.data)

/**
 * Получить детали автомобиля по ID
 * @param {number} carId - ID автомобиля
 * @returns {Promise<Object>}
 */
export const getCarById = (carId) =>
    api.get(`/car/${carId}`).then(r => r.data)