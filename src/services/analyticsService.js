import api from './api'

/**
 * Получить статистику пользователя
 * @returns {Promise<Object>}
 */
export const getUserStats = () => {
  return api.get('/stats/overview/client').then(response => response.data)
}

/**
 * Получить топ пользователей по поездкам за последний месяц
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>}
 */
export const getRideStatsLastMonth = (params = { page: 0, size: 10 }) => {
  return api.get('/stats/ridesLastMonth', { params }).then(response => response.data)
}

/**
 * Получить топ пользователей по поездкам за все время
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>}
 */
export const getRideStatsAllTime = (params = { page: 0, size: 10 }) => {
  return api.get('/stats/rideStats', { params }).then(response => response.data)
}

/**
 * Получить топ машин по прибыли за период
 * @param {string} from - начальная дата (YYYY-MM-DD)
 * @param {string} to - конечная дата (YYYY-MM-DD)
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>}
 */
export const getTopCarsByProfit = (from, to, params = { page: 0, size: 10 }) => {
  return api.get('/admin/stats/cars/top', {
    params: { from, to, ...params }
  }).then(response => response.data)
}

/**
 * Получить аналитику по всем машинам за период
 * @param {string} from - начальная дата (YYYY-MM-DD)
 * @param {string} to - конечная дата (YYYY-MM-DD)
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>}
 */
export const getAllCarsAnalytics = (from, to, params = { page: 0, size: 20 }) => {
  return api.get('/admin/stats/cars/analytics', {
    params: { from, to, ...params }
  }).then(response => response.data)
}
