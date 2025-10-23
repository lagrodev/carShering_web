import api from "../services/api.js";

// Все вызовы через `api` (axios с withCredentials: true)

export const clientApi = {
    // Каталог
    async getCars(params = {}) {
        const res = await api.get('/car/catalogue', { params });
        return res.data;
    },

    // Детали авто
    async getCar(id) {
        const res = await api.get(`/car/${id}`);
        return res.data;
    },

    // Профиль текущего пользователя
    async getUser() {
        const res = await api.get('/profile');
        return res.data;
    },

    // Регистрация
    async register(userData) {
        const res = await api.post('/registration', userData);
        return res.data;
    },

    // Создание договора (аренды)
    async createContract(data) {
        const res = await api.post('/contracts', data);
        return res.data;
    }
};