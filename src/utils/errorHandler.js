/**
 * Универсальный обработчик ошибок от бэкенда
 * Автоматически извлекает сообщение об ошибке из response
 * 
 * @param {Error} error - Объект ошибки от axios
 * @param {string} defaultMessage - Сообщение по умолчанию, если не удалось извлечь из response
 * @returns {string} - Сообщение об ошибке для отображения пользователю
 */
export const getErrorMessage = (error, defaultMessage = 'Произошла ошибка') => {
  // Если ошибка от бэкенда (есть response)
  if (error.response) {
    // Пробуем извлечь сообщение из разных возможных полей
    const message = 
      error.response.data?.message ||  // Стандартное поле message
      error.response.data?.error ||    // Альтернативное поле error
      error.response.data?.details ||  // Детали ошибки
      error.response.statusText        // Текст статуса HTTP
    
    return message || defaultMessage
  }
  
  // Если это сетевая ошибка (нет response)
  if (error.request) {
    return 'Ошибка соединения с сервером. Проверьте интернет-соединение.'
  }
  
  // Если это другая ошибка
  return error.message || defaultMessage
}

/**
 * Проверка, является ли ошибка ошибкой аутентификации
 * @param {Error} error - Объект ошибки от axios
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response?.status === 401
}

/**
 * Проверка, является ли ошибка ошибкой валидации
 * @param {Error} error - Объект ошибки от axios
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error.response?.status === 403 || error.response?.status === 400
}

/**
 * Проверка, является ли ошибка ошибкой "не найдено"
 * @param {Error} error - Объект ошибки от axios
 * @returns {boolean}
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404
}
