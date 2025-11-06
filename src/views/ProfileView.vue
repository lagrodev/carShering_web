<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProfile, updateProfile, changePassword, getDocument as fetchDocument, createDocument as addDoc, updateDocument as updateDoc } from '../services/profileService.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useNotification } from '../composables/useNotification'
import { getErrorMessage } from '../utils/errorHandler'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Button from '../components/ui/Button.vue'
import api from '../services/api'

const authStore = useAuthStore()
const { showConfirm } = useNotification()

const user = ref(null)
const document = ref(null)
const loading = ref(false)
const router = useRouter()

const editMode = ref(false)
const documentEditMode = ref(false)
const passwordMode = ref(false)
const saving = ref(false)
const showDeleteModal = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

const editForm = ref({
  firstName: '',
  lastName: '',
  phone: ''
})

const documentForm = ref({
  documentTypeId: 1,
  series: '',
  number: '',
  dateOfIssue: '',
  issuingAuthority: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)

const today = computed(() => new Date().toISOString().split('T')[0])

const showMessage = (message, isError = false) => {
  if (isError) {
    errorMessage.value = message
    successMessage.value = ''
  } else {
    successMessage.value = message
    errorMessage.value = ''
  }
  
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

const loadProfile = async () => {
  loading.value = true
  try {
    user.value = await getProfile()
  } catch (error) {
    if (error.response?.status === 401) {
      await router.push('/auth')
    } else {
      console.error('Unexpected error loading profile:', error)
      await router.push('/auth')
    }
  } finally {
    loading.value = false
  }
}

const loadDocument = async () => {
  try {
    const result = await fetchDocument()
    // Если getDocument вернул null (404), это нормально
    document.value = result
  } catch (error) {
    // Обрабатываем только критические ошибки (не 404)
    if (error.response?.status === 401) {
      router.push('/auth')
    }
    // Не логируем 404 и 401 - они обработаны
  }
}

const enableEditMode = () => {
  editForm.value = {
    firstName: user.value.firstName || '',
    lastName: user.value.lastName || '',
    phone: user.value.phone || ''
  }
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  editForm.value = { firstName: '', lastName: '', phone: '' }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await updateProfile(editForm.value)
    await loadProfile()
    editMode.value = false
    showMessage('Профиль успешно обновлен')
  } catch (error) {
    //console.error('Error updating profile:', error)
    showMessage(getErrorMessage(error, 'Ошибка при обновлении профиля'), true)
  } finally {
    saving.value = false
  }
}

const addDocument = () => {
  documentForm.value = {
    documentTypeId: 1,
    series: '',
    number: '',
    dateOfIssue: '',
    issuingAuthority: ''
  }
  documentEditMode.value = true
}

const editDocument = () => {
  documentForm.value = {
    documentTypeId: document.value.documentTypeId || 1,
    series: document.value.series || '',
    number: document.value.number || '',
    dateOfIssue: formatDateForInput(document.value.dateOfIssue) || '',
    issuingAuthority: document.value.issuingAuthority || ''
  }
  documentEditMode.value = true
}

const cancelDocumentEdit = () => {
  documentEditMode.value = false
  documentForm.value = { documentTypeId: 1, series: '', number: '', dateOfIssue: '', issuingAuthority: '' }
}

const saveDocument = async () => {
  saving.value = true
  try {
    if (document.value) {
      await updateDoc(documentForm.value)
      showMessage('Документ успешно обновлен')
    } else {
      await addDoc(documentForm.value)
      showMessage('Документ успешно добавлен')
    }
    await loadDocument()
    documentEditMode.value = false
  } catch (error) {
    console.error('Error saving document:', error)
    showMessage(getErrorMessage(error, 'Ошибка при сохранении документа'), true)
  } finally {
    saving.value = false
  }
}

const deleteDocument = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Удаление документа',
    message: 'Вы уверены, что хотите удалить документ?'
  })
  if (!confirmed) return
  
  saving.value = true
  try {
    await api.delete('/profile/document')
    document.value = null
    documentEditMode.value = false
    showMessage('Документ успешно удален')
  } catch (error) {
    console.error('Error deleting document:', error)
    showMessage(getErrorMessage(error, 'Ошибка при удалении документа'), true)
  } finally {
    saving.value = false
  }
}

const cancelPasswordEdit = () => {
  passwordMode.value = false
  passwordForm.value = { oldPassword: '', newPassword: '' }
  showOldPassword.value = false
  showNewPassword.value = false
}

const savePassword = async () => {
  if (passwordForm.value.newPassword.length < 6) {
    showMessage('Новый пароль должен содержать минимум 6 символов', true)
    return
  }
  
  saving.value = true
  try {
    await changePassword(passwordForm.value)
    passwordMode.value = false
    passwordForm.value = { oldPassword: '', newPassword: '' }
    showOldPassword.value = false
    showNewPassword.value = false
    showMessage('Пароль успешно изменен')
  } catch (error) {
    console.error('Error changing password:', error)
    showMessage(getErrorMessage(error, 'Ошибка при смене пароля'), true)
  } finally {
    saving.value = false
  }
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const deleteAccount = async () => {
  saving.value = true
  showDeleteModal.value = false
  
  try {
    await api.delete('/profile')
    
    // Немедленно очищаем состояние аутентификации через store
    // Это обновит Header и все компоненты, использующие authStore
    await authStore.logout()
    
    // Сразу переходим на главную страницу
    // Header уже будет в состоянии "не авторизован" благодаря authStore.logout()
    router.push('/')
  } catch (error) {
    // Ошибка 404 может быть если эндпоинт не реализован на бэкенде
    // Показываем сообщение пользователю, но не логируем в консоль
    if (error.response?.status === 404) {
      showMessage('Функция удаления аккаунта временно недоступна. Обратитесь к администратору.', true)
    } else {
      showMessage('Ошибка при удалении аккаунта', true)
    }
  } finally {
    saving.value = false
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/auth')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

onMounted(async () => {
  await loadProfile()
  await loadDocument()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl md:text-4xl font-bold">Мой профиль</h1>
        <p class="text-primary-100 mt-2">Управление личными данными и документами</p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 800px;">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center" style="min-height: 800px;">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="space-y-6">
        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-800 font-medium">{{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-800 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- User Info Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header with Avatar -->
          <div class="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-8 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {{ user?.firstName?.[0]?.toUpperCase() || 'U' }}{{ user?.lastName?.[0]?.toUpperCase() || '' }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ user?.firstName || '' }} {{ user?.lastName || '' }}
                  </h2>
                  <p class="text-gray-600 mt-1">@{{ user?.login || '' }}</p>
                </div>
              </div>
              <button
                v-if="!editMode"
                @click="enableEditMode"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Редактировать
              </button>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
            
            <!-- View Mode -->
            <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="flex items-center text-sm font-medium text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Имя
                </label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ user?.firstName || '—' }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="flex items-center text-sm font-medium text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Фамилия
                </label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ user?.lastName || '—' }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="flex items-center text-sm font-medium text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ user?.email || '—' }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="flex items-center text-sm font-medium text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Телефон
                </label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ user?.phone || '—' }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="flex items-center text-sm font-medium text-gray-700">
                  <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Логин
                </label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ user?.login || '—' }}
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <form v-else @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">Имя</label>
                  <input
                    id="firstName"
                    v-model="editForm.firstName"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="space-y-2">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Фамилия</label>
                  <input
                    id="lastName"
                    v-model="editForm.lastName"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Телефон</label>
                  <input
                    id="phone"
                    v-model="editForm.phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div class="flex gap-3 pt-4">
                <Button type="submit" variant="primary" :disabled="saving">
                  {{ saving ? 'Сохранение...' : 'Сохранить' }}
                </Button>
                <Button type="button" variant="outline" @click="cancelEdit">Отмена</Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Driver License Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900">Водительское удостоверение</h3>
                <span v-if="document?.verified" class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Подтверждено администрацией
                </span>
                <span v-else-if="document" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  Ожидает проверки
                </span>
              </div>
            </div>
            <button
              v-if="!document && !documentEditMode"
              @click="addDocument"
              class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Добавить
            </button>
            <button
              v-else-if="document && !documentEditMode"
              @click="editDocument"
              class="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
          </div>

          <div class="p-6">
            <!-- No Document -->
            <div v-if="!document && !documentEditMode" class="text-center py-8">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-600">Водительское удостоверение не добавлено</p>
              <p class="text-sm text-gray-500 mt-1">Добавьте документ для аренды автомобилей</p>
            </div>

            <!-- View Document -->
            <div v-else-if="document && !documentEditMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Серия</label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ document.series }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Номер</label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ document.number }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Дата выдачи</label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ formatDate(document.dateOfIssue) }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Орган выдачи</label>
                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {{ document.issuingAuthority }}
                </div>
              </div>
            </div>

            <!-- Edit Document -->
            <form v-else @submit.prevent="saveDocument" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="series" class="block text-sm font-medium text-gray-700">
                    Серия <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="series"
                    v-model="documentForm.series"
                    type="text"
                    required
                    placeholder="12 34"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="space-y-2">
                  <label for="number" class="block text-sm font-medium text-gray-700">
                    Номер <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="number"
                    v-model="documentForm.number"
                    type="text"
                    required
                    placeholder="567890"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="space-y-2">
                  <label for="dateOfIssue" class="block text-sm font-medium text-gray-700">
                    Дата выдачи <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfIssue"
                    v-model="documentForm.dateOfIssue"
                    type="date"
                    required
                    :max="today"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="space-y-2">
                  <label for="issuingAuthority" class="block text-sm font-medium text-gray-700">
                    Орган выдачи <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="issuingAuthority"
                    v-model="documentForm.issuingAuthority"
                    type="text"
                    required
                    placeholder="ГИБДД 1234"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div class="flex gap-3 pt-4">
                <Button type="submit" variant="primary" :disabled="saving">
                  {{ saving ? 'Сохранение...' : 'Сохранить' }}
                </Button>
                <Button type="button" variant="outline" @click="cancelDocumentEdit">Отмена</Button>
                <Button
                  v-if="document"
                  type="button"
                  variant="danger"
                  @click="deleteDocument"
                  class="ml-auto"
                >
                  Удалить
                </Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Security Settings Card -->
        <!-- Security Settings Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Безопасность</h3>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Change Password Section -->
            <div class="border-b border-gray-200 pb-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-base font-semibold text-gray-900 mb-1">Смена пароля</h4>
                  <p class="text-sm text-gray-600">Обновите пароль для повышения безопасности аккаунта</p>
                </div>
                <button
                  v-if="!passwordMode"
                  @click="passwordMode = true"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Изменить
                </button>
              </div>

              <form v-if="passwordMode" @submit.prevent="savePassword" class="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div class="space-y-2">
                  <label for="oldPassword" class="block text-sm font-medium text-gray-700">
                    Текущий пароль <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="oldPassword"
                      v-model="passwordForm.oldPassword"
                      :type="showOldPassword ? 'text' : 'password'"
                      required
                      class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      @click="showOldPassword = !showOldPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg v-if="showOldPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">
                    Новый пароль <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      required
                      minlength="6"
                      class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500">Минимум 6 символов</p>
                </div>

                <div class="flex gap-3">
                  <Button type="submit" variant="primary" :disabled="saving">
                    {{ saving ? 'Сохранение...' : 'Изменить пароль' }}
                  </Button>
                  <Button type="button" variant="outline" @click="cancelPasswordEdit">Отмена</Button>
                </div>
              </form>
            </div>

            <!-- Delete Account Section -->
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-base font-semibold text-gray-900 mb-1">Удаление аккаунта</h4>
                  <p class="text-sm text-gray-600">Безвозвратное удаление аккаунта и всех связанных данных</p>
                </div>
                <button
                  @click="openDeleteModal"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <Button variant="outline" @click="logout" class="ml-auto">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Delete Account Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="closeDeleteModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Удалить аккаунт</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Это действие безвозвратно удалит ваш аккаунт и все связанные данные. 
                Вы уверены, что хотите продолжить?
              </p>
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button
              @click="closeDeleteModal"
              :disabled="saving"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              @click="deleteAccount"
              :disabled="saving"
              class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ saving ? 'Удаление...' : 'Удалить' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from > div {
  transform: scale(0.95);
}

.modal-fade-leave-to > div {
  transform: scale(0.95);
}
</style>
