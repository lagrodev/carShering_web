<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Управление документами</h2>
    </div>

    <!-- Filter Toggle -->
    <Card class="mb-6" padding="lg">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Фильтр</h3>
          <p class="text-sm text-gray-600 mt-1">Показывать только непроверенные документы</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            v-model="onlyUnverified" 
            @change="loadDocuments(0)"
            class="sr-only peer"
          >
          <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </Card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка документов...</p>
      </div>
    </div>

    <!-- Documents Grid -->
    <div v-else-if="documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="doc in documents" 
        :key="doc.id"
        class="hover:shadow-lg transition-all"
        padding="lg"
      >
        <div class="space-y-4">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <span :class="doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" 
                  class="px-3 py-1 text-xs font-semibold rounded-full">
              {{ doc.verified ? 'Проверен' : 'Не проверен' }}
            </span>
            <span class="text-xs text-gray-500">ID: {{ doc.id }}</span>
          </div>

          <!-- Document Info -->
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Тип документа</p>
              <p class="text-sm font-semibold text-gray-900">{{ doc.documentType }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Серия</p>
                <p class="text-sm font-semibold text-gray-900">{{ doc.series }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Номер</p>
                <p class="text-sm font-semibold text-gray-900">{{ doc.number }}</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Дата выдачи</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatDate(doc.dateOfIssue) }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Орган выдачи</p>
              <p class="text-sm font-semibold text-gray-900">{{ doc.issuingAuthority }}</p>
            </div>
          </div>

          <!-- Action Button -->
          <button
            v-if="!doc.verified"
            @click="verifyDocument(doc.id)"
            class="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Подтвердить
          </button>
          <div v-else class="text-center py-2 text-green-600 font-semibold flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Документ проверен
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Документы не найдены</h3>
      <p class="text-gray-600">
        {{ onlyUnverified ? 'Все документы проверены' : 'В системе нет документов' }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1 && !loading" class="mt-6">
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page - 1)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            currentPage === page - 1
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import { useNotification } from '../../composables/useNotification'
import api from '../../services/api'
import Card from '../ui/Card.vue'

const { showNotification, showConfirm } = useNotification()

const documents = ref([])
const loading = ref(false)
const onlyUnverified = ref(true)
const currentPage = ref(0)
const totalPages = ref(0)

const loadDocuments = async (page = 0) => {
  loading.value = true
  try {
    const params = {
      onlyUnverified: onlyUnverified.value,
      page: page,
      size: 20
    }
    
    const response = await api.get('/admin/documents', { params })
    
    // Backend возвращает формат: { content: [...], page: { size, number, totalElements, totalPages } }
    documents.value = response.data.content || []
    currentPage.value = response.data.page?.number || 0
    totalPages.value = response.data.page?.totalPages || 0
  } catch (error) {
    console.error('Error loading documents:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки документов')
    })
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  loadDocuments(page)
}

const verifyDocument = async (documentId) => {
  const confirmed = await showConfirm({
    type: 'info',
    title: 'Подтверждение документа',
    message: 'Вы уверены, что хотите подтвердить этот документ? Пожалуйста, убедитесь, что все данные корректны.'
  })
  
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/documents/${documentId}/verify`)
    await loadDocuments(currentPage.value)
    showNotification({
      type: 'success',
      message: 'Документ успешно подтвержден'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка подтверждения документа')
    })
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

onMounted(() => {
  loadDocuments()
})
</script>
