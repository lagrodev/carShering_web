import api from './api.js'

/**
 * Получить список договоров пользователя
 */
export async function getUserContracts() {
  try {
    const response = await api.get('/contracts')
    // API возвращает объект с полем content, которое содержит массив
    return response.data.content || response.data || []
  } catch (error) {
    console.error('Error fetching contracts:', error)
    throw error
  }
}

/**
 * Получить детали договора по ID
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
 */
export async function createContract(contractData) {
  try {
    const response = await api.post('/contracts', contractData)
    return response.data
  } catch (error) {
    console.error('Error creating contract:', error)
    throw error
  }
}

/**
 * Обновить статус договора
 */
export async function updateContractStatus(id, status) {
  try {
    const response = await api.patch(`/contracts/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error('Error updating contract status:', error)
    throw error
  }
}

/**
 * Обновить даты договора
 */
export async function updateContract(id, data) {
  try {
    const response = await api.patch(`/contracts/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating contract:', error)
    throw error
  }
}

/**
 * Отменить договор
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