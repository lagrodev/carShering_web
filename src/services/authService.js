// src/services/authService.js
import api from './api'

/**
 * Вход пользователя
 * @param {Object} credentials - { username: string, password: string }
 * @returns {Promise<Object>} - { message: 'Authentication successful' }
 */
export const login = async (credentials) => {
    const response = await api.post('/auth', credentials)
    // Бэкенд устанавливает HTTP-only cookie с токеном
    return response.data
}

/**
 * Регистрация нового пользователя
 * @param {Object} userData - данные для регистрации
 * @returns {Promise<Object>} - данные зарегистрированного пользователя
 */
export const register = async (userData) => {
    const response = await api.post('/registration', userData)
    return response.data
}

/**
 * Выход из системы
 * @returns {Promise<void>}
 */
export const logout = async () => {
    await api.post('/logout')
    // Бэкенд удаляет cookie
}

/**
 * Получить данные текущего пользователя
 * @returns {Promise<Object>} - данные пользователя с ролями
 */
export const getCurrentUser = async () => {
    const response = await api.get('/profile/me')
    return response.data
}

/**
 * Проверка аутентификации пользователя
 * @returns {Promise<boolean>}
 */
export const checkAuth = async () => {
    try {
        await api.get('/profile/me')
        return true
    } catch {
        return false
    }
}