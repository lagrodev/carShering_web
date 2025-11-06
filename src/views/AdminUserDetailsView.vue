<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Back Button -->
      <button
        @click="router.push('/admin')"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к панели администратора
      </button>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Загрузка информации о пользователе...</p>
        </div>
      </div>

      <!-- User Info -->
      <div v-else-if="user" class="space-y-6">
        <!-- Header Card -->
        <Card padding="lg">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900">
                  {{ user.firstName || 'Не указано' }} {{ user.lastName || '' }}
                </h1>
                <span :class="getRoleClass(user.roleName)" class="px-3 py-1 text-sm font-semibold rounded-full">
                  {{ translateRole(user.roleName) }}
                </span>
              </div>
              <p class="text-gray-600">@{{ user.login }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span :class="user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" 
                      class="px-2.5 py-1 text-xs font-semibold rounded-full">
                  {{ user.banned ? 'Заблокирован' : 'Активен' }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <button
                v-if="!user.banned"
                @click="banUser"
                class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Заблокировать
              </button>
              <button
                v-else
                @click="unbanUser"
                class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Разблокировать
              </button>
              <button
                @click="showRoleModal = true"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Изменить роль
              </button>
            </div>
          </div>
        </Card>

        <!-- Contact Info -->
        <Card padding="lg">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Контактная информация</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Email</p>
              <p class="text-base font-semibold text-gray-900">{{ user.email || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Телефон</p>
              <p class="text-base font-semibold text-gray-900">{{ user.phone || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">ID пользователя</p>
              <p class="text-base font-semibold text-gray-900">{{ user.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Логин</p>
              <p class="text-base font-semibold text-gray-900">{{ user.login }}</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-20">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Пользователь не найден</h3>
        <p class="text-gray-600 mb-6">Не удалось загрузить информацию о пользователе</p>
        <Button variant="primary" @click="router.push('/admin')">Вернуться к панели</Button>
      </div>
    </main>

    <Footer />

    <!-- Role Change Modal -->
    <Transition name="modal-fade">
      <div v-if="showRoleModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h3 class="text-xl font-bold text-gray-900">Изменить роль</h3>
            <button
              @click="showRoleModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRole" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Новая роль <span class="text-red-500">*</span>
              </label>
              <select
                v-model="newRole"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="USER">Пользователь</option>
                <option value="ADMIN">Администратор</option>
              </select>
            </div>

            <div v-if="roleError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {{ roleError }}
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="showRoleModal = false"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="updatingRole"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
              >
                {{ updatingRole ? 'Обновление...' : 'Обновить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getErrorMessage } from '../utils/errorHandler'
import { useNotification } from '../composables/useNotification'
import api from '../services/api'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const { showNotification, showConfirm } = useNotification()

const user = ref(null)
const loading = ref(false)
const showRoleModal = ref(false)
const newRole = ref('')
const updatingRole = ref(false)
const roleError = ref('')

const loadUser = async () => {
  loading.value = true
  try {
    const response = await api.get(`/admin/users/${route.params.id}`)
    user.value = response.data
    newRole.value = user.value.roleName
  } catch (error) {
    console.error('Error loading user:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки пользователя')
    })
  } finally {
    loading.value = false
  }
}

const translateRole = (role) => {
  const translations = {
    'USER': 'Пользователь',
    'ADMIN': 'Администратор'
  }
  return translations[role] || role
}

const getRoleClass = (role) => {
  return role === 'ADMIN' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-blue-100 text-blue-800'
}

const banUser = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение блокировки',
    message: 'Вы уверены, что хотите заблокировать этого пользователя?'
  })
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/users/${user.value.id}/ban`)
    await loadUser()
    showNotification({
      type: 'success',
      message: 'Пользователь успешно заблокирован'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка блокировки пользователя')
    })
  }
}

const unbanUser = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение разблокировки',
    message: 'Вы уверены, что хотите разблокировать этого пользователя?'
  })
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/users/${user.value.id}/unban`)
    await loadUser()
    showNotification({
      type: 'success',
      message: 'Пользователь успешно разблокирован'
    })
  } catch (error) {
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка разблокировки пользователя')
    })
  }
}

const updateRole = async () => {
  updatingRole.value = true
  roleError.value = ''
  
  try {
    await api.patch(`/admin/users/${user.value.id}/updateRole`, {
      RoleName: newRole.value
    })
    await loadUser()
    showRoleModal.value = false
  } catch (error) {
    roleError.value = getErrorMessage(error, 'Ошибка изменения роли')
  } finally {
    updatingRole.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
