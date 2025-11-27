// src/services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
    withCredentials: true, // ← ОБЯЗАТЕЛЬНО для работы с cookies!
    timeout: 10000
})

// Флаг для предотвращения множественных запросов refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Интерцептор для автоматического обновления токена
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Если получили 401 и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
            const url = originalRequest.url || ''
            
            console.log('[API Interceptor] 401 ошибка для запроса:', url)
            
            // Не пытаемся рефрешить для логина, регистрации, самого рефреша и logout
            if (url.includes('/auth') || url.includes('/registration') || url.includes('/refresh') || url.includes('/logout')) {
                console.log('[API Interceptor] Игнорируем refresh для:', url)
                return Promise.reject(error)
            }

            if (isRefreshing) {
                console.log('[API Interceptor] Refresh уже в процессе, добавляем в очередь')
                // Если уже идет обновление токена, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    console.log('[API Interceptor] Повторяем запрос из очереди:', url)
                    return api(originalRequest)
                }).catch(err => {
                    console.error('[API Interceptor] Ошибка при повторе запроса из очереди:', err)
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            console.log('[API Interceptor] Начинаем обновление токена')

            try {
                // Пытаемся обновить токен
                const response = await api.post('/refresh')
                console.log('[API Interceptor] Токен успешно обновлён:', response.status)
                
                processQueue(null)
                isRefreshing = false
                
                // Повторяем оригинальный запрос
                console.log('[API Interceptor] Повторяем оригинальный запрос:', url)
                return api(originalRequest)
            } catch (refreshError) {
                console.error('[API Interceptor] Ошибка обновления токена:', refreshError.response?.status)
                
                // Если refresh не удался, очищаем очередь
                processQueue(refreshError)
                isRefreshing = false
                
                // Перенаправляем на страницу логина при неудачном refresh
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
                    console.log('[API Interceptor] Перенаправление на страницу входа')
                    window.location.href = '/auth'
                }
                
                return Promise.reject(refreshError)
            }
        }
        
        return Promise.reject(error)
    }
)

export default api