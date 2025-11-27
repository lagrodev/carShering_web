import api from './api'

/**
 * Получить профиль пользователя
 * @returns {Promise<Object>}
 */
export const getProfile = () => {
    return api.get('/profile').then(response => response.data)
}

/**
 * Обновить профиль пользователя
 * @param {Object} data - данные профиля
 * @returns {Promise<void>}
 */
export const updateProfile = (data) => {
    return api.patch('/profile', data)
}

/**
 * Изменить пароль пользователя
 * @param {Object} data - { oldPassword, newPassword }
 * @returns {Promise<void>}
 */
export const changePassword = (data) => {
    return api.patch('/profile/password', data)
}

/**
 * Удалить профиль пользователя
 * @returns {Promise<void>}
 */
export const deleteProfile = () => {
    return api.delete('/profile')
}

/**
 * Получить документ пользователя
 * @returns {Promise<Object|null>}
 */
export const getDocument = () => {
    return api.get('/profile/document', {
        validateStatus: (status) => status < 500
    }).then(response => {
        if (response.status === 404 || response.status === 204) {
            return null
        }
        return response.data
    })
}

/**
 * Создать документ пользователя
 * @param {Object} data - данные документа
 * @returns {Promise<Object>}
 */
export const createDocument = (data) => {
    return api.post('/profile/document', data).then(response => response.data)
}

/**
 * Обновить документ пользователя
 * @param {Object} data - данные документа
 * @returns {Promise<Object>}
 */
export const updateDocument = (data) => {
    return api.patch('/profile/document', data).then(response => response.data)
}

/**
 * Удалить документ пользователя
 * @returns {Promise<void>}
 */
export const deleteDocument = () => {
    return api.delete('/profile/document')
}

/**
 * Получить информацию об авторизации
 * @returns {Promise<Object>}
 */
export const getAuthInfo = () => {
    return api.get('/profile/me', { withCredentials: true }).then(res => res.data)
}

/**
 * Отправить письмо для верификации email
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = () => {
    return api.get('/profile/verify')
}