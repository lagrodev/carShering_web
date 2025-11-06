// src/services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
    withCredentials: true, // ← ОБЯЗАТЕЛЬНО для работы с cookies!
    timeout: 10000
})

// Интерцептор для обработки ошибок аутентификации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Если получили 401 (Unauthorized), НЕ редиректим автоматически
        // Позволяем компонентам самим решать, что делать с ошибкой
        // Редирект будет только через router guard для защищённых маршрутов
        
        // Подавляем вывод 401 ошибок в консоль (это нормально для гостей)
        if (error.response?.status === 401) {
            return Promise.reject(error)
        }
        
        // Подавляем 404 для отсутствующих необязательных ресурсов профиля
        if (error.response?.status === 404) {
            const url = error.config?.url || ''
            // Документ и профиль могут отсутствовать - это нормально
            if (url.includes('/profile')) {
                return Promise.reject(error)
            }
        }
        
        return Promise.reject(error)
    }
)

export default api