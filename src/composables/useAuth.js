// composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

/**
 * Composable для работы с аутентификацией
 * Предоставляет удобный API для проверки прав и управления сессией
 * 
 * @example
 * import { useAuth } from '@/composables/useAuth'
 * 
 * const { isAuthenticated, requireAuth, logout } = useAuth()
 * 
 * if (requireAuth()) {
 *   // Выполнить действие
 * }
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  /**
   * Проверяет, авторизован ли пользователь
   * Если нет - перенаправляет на страницу входа
   * @returns {boolean} true если авторизован
   */
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push({ 
        name: 'Auth', 
        query: { redirect: router.currentRoute.value.fullPath } 
      })
      return false
    }
    return true
  }
  
  /**
   * Проверяет, является ли пользователь администратором
   * Если нет - показывает предупреждение
   * @returns {boolean} true если администратор
   */
  const requireAdmin = () => {
    if (!authStore.isAdmin) {
      alert('Требуются права администратора')
      return false
    }
    return true
  }
  
  /**
   * Проверяет наличие конкретной роли у пользователя
   * @param {string} role - название роли (например, 'ROLE_ADMIN')
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return authStore.userRoles.includes(role)
  }
  
  /**
   * Проверяет наличие хотя бы одной из указанных ролей
   * @param {string[]} roles - массив ролей
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.some(role => authStore.userRoles.includes(role))
  }
  
  /**
   * Проверяет наличие всех указанных ролей
   * @param {string[]} roles - массив ролей
   * @returns {boolean}
   */
  const hasAllRoles = (roles) => {
    return roles.every(role => authStore.userRoles.includes(role))
  }
  
  /**
   * Выполняет действие только если пользователь авторизован
   * @param {Function} callback - функция для выполнения
   * @returns {Promise<any>}
   */
  const withAuth = async (callback) => {
    if (!requireAuth()) return null
    return await callback()
  }
  
  /**
   * Выполняет действие только если пользователь - администратор
   * @param {Function} callback - функция для выполнения
   * @returns {Promise<any>}
   */
  const withAdmin = async (callback) => {
    if (!requireAdmin()) return null
    return await callback()
  }
  
  return {
    // Computed свойства
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    username: computed(() => authStore.username),
    userRoles: computed(() => authStore.userRoles),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Методы проверки
    requireAuth,
    requireAdmin,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Методы с коллбэками
    withAuth,
    withAdmin,
    
    // Методы аутентификации
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    clearError: authStore.clearError
  }
}
