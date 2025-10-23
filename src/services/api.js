// src/services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
    withCredentials: true, // ← ОБЯЗАТЕЛЬНО!
    timeout: 10000
})

export default api