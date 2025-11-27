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
 * Обновить access token используя refresh token
 * @returns {Promise<void>}
 */
export const refreshToken = async () => {
    const response = await api.post('/refresh')
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

/**
 * Запросить сброс пароля
 * @param {string} email - email пользователя
 * @returns {Promise<void>}
 */
export const requestPasswordReset = async (email) => {
    console.log('[authService] Запрос сброса пароля для email:', email)
    const response = await api.post('/reset-password', { email })
    console.log('[authService] Ответ от сервера:', response.data)
    return response.data
}

/**
 * Сбросить пароль с кодом
 * @param {string} code - код сброса пароля
 * @param {string} newPassword - новый пароль
 * @returns {Promise<void>}
 */
export const resetPassword = async (code, newPassword) => {
    console.log('[authService] Запрос сброса пароля с code:', code)
    console.log('[authService] Новый пароль (длина):', newPassword.length)
    const response = await api.post('/reset', 
        { password: newPassword },
        { params: { code } }
    )
    console.log('[authService] Ответ от сервера:', response.data)
    return response.data
}