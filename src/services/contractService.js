import api from './api.js'

/**
 * Получить список договоров пользователя
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>}
 */
export async function getUserContracts(params = {}) {
  try {
    const response = await api.get('/contracts', { params })
    return response.data.content || response.data || []
  } catch (error) {
    console.error('Error fetching contracts:', error)
    throw error
  }
}

/**
 * Получить детали договора по ID
 * @param {number} id - ID договора
 * @returns {Promise<Object>}
 */
export async function getContractById(id) {
  try {
    const response = await api.get(`/contracts/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching contract:', error)
    throw error
  }
}

/**
 * Создать новый договор
 * @param {Object} contractData - { carId, dataStart, dataEnd }
 * @returns {Promise<Object>}
 */
export async function createContract(contractData) {
  try {
    // Преобразуем даты в формат ISO 8601 для LocalDateTime
    const payload = {
      carId: contractData.carId,
      dataStart: contractData.dataStart, // datetime-local уже в формате ISO
      dataEnd: contractData.dataEnd
    }
    const response = await api.post('/contracts', payload)
    return response.data
  } catch (error) {
    console.error('Error creating contract:', error)
    throw error
  }
}

/**
 * Обновить даты договора
 * @param {number} id - ID договора
 * @param {Object} data - { dataStart, dataEnd }
 * @returns {Promise<Object>}
 */
export async function updateContract(id, data) {
  try {
    // Преобразуем даты в формат ISO 8601 для LocalDateTime
    const payload = {
      dataStart: data.dataStart,
      dataEnd: data.dataEnd
    }
    const response = await api.patch(`/contracts/${id}`, payload)
    return response.data
  } catch (error) {
    console.error('Error updating contract:', error)
    throw error
  }
}

/**
 * Отменить договор пользователем
 * @param {number} id - ID договора
 * @returns {Promise<void>}
 */
export async function cancelContract(id) {
  try {
    const response = await api.delete(`/contracts/${id}/cancel`)
    return response.data
  } catch (error) {
    console.error('Error cancelling contract:', error)
    throw error
  }
}