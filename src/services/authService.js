// src/services/authService.js
import api from './api'

export const login = async (credentials) => {
    const response = await api.post('/auth', credentials)
    return response.data // просто подтверждение
}

export const register = async (userData) => {
    const response = await api.post('/registration', userData)
    return response.data
}

// Logout — вызывает бэкенд, который удаляет cookie
export const logout = async () => {
    await api.post('/logout')
}