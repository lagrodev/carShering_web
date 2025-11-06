// src/store/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '../services/authService'
import { getErrorMessage } from '../utils/errorHandler'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => {
        return user.value?.authorities?.some(a =>
            a.authority === 'ROLE_ADMIN' || a.authority === 'ROLE_MANAGER'
        ) || false
    })
    const username = computed(() => user.value?.username || '')
    const userRoles = computed(() => {
        return user.value?.authorities?.map(a => a.authority) || []
    })

    // Actions
    async function login(credentials) {
        loading.value = true
        error.value = null
        try {
            await authService.login(credentials)
            await fetchUser()
            return true
        } catch (err) {
            error.value = getErrorMessage(err, 'Ошибка входа')
            throw err
        } finally {
            loading.value = false
        }
    }

    async function register(userData) {
        loading.value = true
        error.value = null
        try {
            const response = await authService.register(userData)
            // После регистрации можно автоматически войти
            return response
        } catch (err) {
            error.value = getErrorMessage(err, 'Ошибка регистрации')
            throw err
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        loading.value = true
        try {
            await authService.logout()
            user.value = null
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchUser() {
        loading.value = true
        try {
            const userData = await authService.getCurrentUser()
            user.value = userData
            return userData
        } catch (err) {
            user.value = null
            // Не бросаем ошибку дальше - просто возвращаем null
            return null
        } finally {
            loading.value = false
        }
    }

    async function checkAuth() {
        try {
            const userData = await fetchUser()
            return !!userData
        } catch {
            return false
        }
    }

    function clearError() {
        error.value = null
    }

    return {
        // State
        user,
        loading,
        error,
        // Getters
        isAuthenticated,
        isAdmin,
        username,
        userRoles,
        // Actions
        login,
        register,
        logout,
        fetchUser,
        checkAuth,
        clearError
    }
})
