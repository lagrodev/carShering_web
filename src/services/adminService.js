import api from './api'

// ==================== Admin Car Management ====================

/**
 * Получить список автомобилей (админ)
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getAdminCars = (params) => {
    return api.get('/admin/cars', { params }).then(r => r.data)
}

/**
 * Получить автомобиль по ID (админ)
 * @param {number} carId - ID автомобиля
 * @returns {Promise<Object>}
 */
export const getAdminCarById = (carId) => {
    return api.get(`/admin/cars/${carId}`).then(r => r.data)
}

/**
 * Создать автомобиль с изображением
 * @param {Object} carData - { modelId, yearOfIssue, gosNumber, vin, rent, stateId }
 * @param {File} imageFile - файл изображения
 * @returns {Promise<Object>}
 */
export const createCar = (carData, imageFile) => {
    const formData = new FormData()
    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }))
    formData.append('image', imageFile)
    
    return api.post('/admin/cars', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(r => r.data)
}

/**
 * Загрузить изображение для автомобиля
 * @param {number} carId - ID автомобиля
 * @param {File} imageFile - файл изображения
 * @returns {Promise<Object>}
 */
export const uploadCarImage = (carId, imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    return api.post(`/admin/${carId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(r => r.data)
}

/**
 * Обновить автомобиль
 * @param {number} carId - ID автомобиля
 * @param {Object} data - обновленные данные
 * @returns {Promise<Object>}
 */
export const updateCar = (carId, data) => {
    return api.patch(`/admin/cars/${carId}`, data).then(r => r.data)
}

/**
 * Удалить автомобиль
 * @param {number} carId - ID автомобиля
 * @returns {Promise<void>}
 */
export const deleteCar = (carId) => {
    return api.delete(`/admin/cars/${carId}`)
}

/**
 * Обновить статус автомобиля
 * @param {number} carId - ID автомобиля
 * @param {string} stateName - название статуса
 * @returns {Promise<Object>}
 */
export const updateCarState = (carId, stateName) => {
    return api.patch(`/admin/cars/${carId}/state`, { stateName }).then(r => r.data)
}

/**
 * Получить все возможные статусы автомобилей
 * @returns {Promise<Array>}
 */
export const getAllCarStates = () => {
    return api.get('/admin/cars/state').then(r => r.data)
}

// ==================== Admin Model Management ====================

/**
 * Получить список моделей (админ)
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getAdminModels = (params) => {
    return api.get('/admin/models', { params }).then(r => r.data)
}

/**
 * Получить модель по ID
 * @param {number} modelId - ID модели
 * @returns {Promise<Object>}
 */
export const getModelById = (modelId) => {
    return api.get(`/admin/models/${modelId}`).then(r => r.data)
}

/**
 * Создать модель
 * @param {Object} data - { brand, model, bodyType, carClass }
 * @returns {Promise<Object>}
 */
export const createModel = (data) => {
    return api.post('/admin/models', data).then(r => r.data)
}

/**
 * Обновить модель
 * @param {number} modelId - ID модели
 * @param {Object} data - обновленные данные
 * @returns {Promise<Object>}
 */
export const updateModel = (modelId, data) => {
    return api.patch(`/admin/models/${modelId}`, data).then(r => r.data)
}

/**
 * Удалить модель
 * @param {number} modelId - ID модели
 * @returns {Promise<void>}
 */
export const deleteModel = (modelId) => {
    return api.delete(`/admin/models/${modelId}`)
}

// ==================== Admin Filters Management ====================

/**
 * Получить список брендов (админ)
 * @returns {Promise<string[]>}
 */
export const getAdminBrands = () => {
    return api.get('/admin/filters/brands').then(r => r.data)
}

/**
 * Создать бренд
 * @param {string} name - название бренда
 * @returns {Promise<Object>}
 */
export const createBrand = (name) => {
    return api.post('/admin/filters/brands', { name }).then(r => r.data)
}

/**
 * Получить список названий моделей (админ)
 * @returns {Promise<string[]>}
 */
export const getAdminModelNames = () => {
    return api.get('/admin/filters/models').then(r => r.data)
}

/**
 * Создать название модели
 * @param {string} name - название модели
 * @returns {Promise<Object>}
 */
export const createModelName = (name) => {
    return api.post('/admin/filters/models', { name }).then(r => r.data)
}

/**
 * Получить список классов (админ)
 * @returns {Promise<string[]>}
 */
export const getAdminClasses = () => {
    return api.get('/admin/filters/classes').then(r => r.data)
}

/**
 * Создать класс автомобиля
 * @param {string} name - название класса
 * @returns {Promise<Object>}
 */
export const createClass = (name) => {
    return api.post('/admin/filters/classes', { name }).then(r => r.data)
}

// ==================== Admin Contract Management ====================

/**
 * Получить список всех договоров (админ)
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getAdminContracts = (params) => {
    return api.get('/admin/contracts', { params }).then(r => r.data)
}

/**
 * Получить договор по ID (админ)
 * @param {number} contractId - ID договора
 * @returns {Promise<Object>}
 */
export const getAdminContractById = (contractId) => {
    return api.get(`/admin/contracts/${contractId}`).then(r => r.data)
}

/**
 * Подтвердить договор
 * @param {number} contractId - ID договора
 * @returns {Promise<Object>}
 */
export const confirmContract = (contractId) => {
    return api.patch(`/admin/contracts/${contractId}/confirm`).then(r => r.data)
}

/**
 * Отменить договор (админ)
 * @param {number} contractId - ID договора
 * @returns {Promise<void>}
 */
export const cancelAdminContract = (contractId) => {
    return api.delete(`/admin/contracts/${contractId}/cancel`)
}

/**
 * Подтвердить отмену договора
 * @param {number} contractId - ID договора
 * @returns {Promise<void>}
 */
export const confirmCancellation = (contractId) => {
    return api.patch(`/admin/contracts/contracts/${contractId}/confirm-cancellation`)
}

// ==================== Admin Client Management ====================

/**
 * Получить список пользователей
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getAdminUsers = (params) => {
    return api.get('/admin/users', { params }).then(r => r.data)
}

/**
 * Получить пользователя по ID
 * @param {number} userId - ID пользователя
 * @returns {Promise<Object>}
 */
export const getUserById = (userId) => {
    return api.get(`/admin/users/${userId}`).then(r => r.data)
}

/**
 * Забанить пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<void>}
 */
export const banUser = (userId) => {
    return api.patch(`/admin/users/${userId}/ban`)
}

/**
 * Разбанить пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<void>}
 */
export const unbanUser = (userId) => {
    return api.patch(`/admin/users/${userId}/unban`)
}

/**
 * Обновить роль пользователя
 * @param {number} userId - ID пользователя
 * @param {string} roleName - название роли
 * @returns {Promise<void>}
 */
export const updateUserRole = (userId, roleName) => {
    return api.patch(`/admin/users/${userId}/updateRole`, { RoleName: roleName })
}

// ==================== Admin Document Management ====================

/**
 * Получить список документов
 * @param {Object} params - параметры фильтрации и пагинации
 * @returns {Promise<Object>}
 */
export const getAdminDocuments = (params) => {
    return api.get('/admin/documents', { params }).then(r => r.data)
}

/**
 * Верифицировать документ
 * @param {number} documentId - ID документа
 * @returns {Promise<void>}
 */
export const verifyDocument = (documentId) => {
    return api.patch(`/admin/documents/${documentId}/verify`)
}

// ==================== Admin Analytics ====================

/**
 * Получить общую статистику системы
 * @returns {Promise<Object>}
 */
export const getAdminOverview = () => {
    return api.get('/admin/stats/overview').then(r => r.data)
}

/**
 * Получить статистику выручки по дням за период
 * @param {string} from - начальная дата (формат: YYYY-MM-DD)
 * @param {string} to - конечная дата (формат: YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
export const getDailyRevenue = (from, to) => {
    return api.get('/admin/stats/daily-revenue', {
        params: { from, to }
    }).then(r => r.data)
}

/**
 * Получить список контрактов за конкретный день
 * @param {string} date - дата (формат: YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
export const getContractsByDay = (date) => {
    return api.get('/admin/stats/contracts-by-day', {
        params: { date }
    }).then(r => r.data)
}
