<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Управление клиентами</h2>
    </div>

    <!-- Filters -->
    <Card class="mb-6" padding="lg">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Фильтры</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Статус</label>
          <select
            v-model="filters.banned"
            @change="loadUsers"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Все</option>
            <option value="false">Активные</option>
            <option value="true">Заблокированные</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Роль</label>
          <select
            v-model="filters.roleName"
            @change="loadUsers"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Все роли</option>
            <option value="USER">Пользователь</option>
            <option value="ADMIN">Администратор</option>
          </select>
        </div>

        <div class="flex items-end">
          <Button variant="outline" @click="resetFilters" class="w-full">
            Сбросить фильтры
          </Button>
        </div>
      </div>
    </Card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка пользователей...</p>
      </div>
    </div>

    <!-- Users Table -->
    <Card v-else-if="users.length > 0" padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Логин</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="user in users" 
              :key="user.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="viewUser(user.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.login }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleClass(user.roleName)" class="px-2.5 py-1 text-xs font-semibold rounded-full">
                  {{ translateRole(user.roleName) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="px-2.5 py-1 text-xs font-semibold rounded-full">
                  {{ user.banned ? 'Заблокирован' : 'Активен' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2" @click.stop>
                  <button
                    v-if="!user.banned"
                    @click="banUser(user.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Заблокировать"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="unbanUser(user.id)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Разблокировать"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="openRoleModal(user)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Изменить роль"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="p in totalPages"
            :key="p"
            @click="goToPage(p - 1)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all text-sm',
              currentPage === p - 1
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </Card>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Пользователи не найдены</h3>
      <p class="text-gray-600">Попробуйте изменить параметры фильтрации</p>
    </div>

    <!-- Role Change Modal -->
    <Transition name="modal-fade">
      <div v-if="showRoleModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h3 class="text-xl font-bold text-gray-900">Изменить роль</h3>
            <button
              @click="closeRoleModal"
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
                Пользователь
              </label>
              <input
                :value="selectedUser?.login"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>

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
                @click="closeRoleModal"
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
import { useRouter } from 'vue-router'
import { getErrorMessage } from '../../utils/errorHandler'
import { useNotification } from '../../composables/useNotification'
import api from '../../services/api'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'

const router = useRouter()
const { showNotification, showConfirm } = useNotification()

const users = ref([])
const loading = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)

const showRoleModal = ref(false)
const selectedUser = ref(null)
const newRole = ref('')
const updatingRole = ref(false)
const roleError = ref('')

const filters = ref({
  banned: '',
  roleName: ''
})

const loadUsers = async (page = 0) => {
  loading.value = true
  try {
    const params = {
      page,
      size: 20
    }
    
    if (filters.value.banned !== '') {
      params.banned = filters.value.banned === 'true'
    }
    if (filters.value.roleName) {
      params.roleName = filters.value.roleName
    }
    
    const response = await api.get('/admin/users', { params })
    users.value = response.data.content || []
    currentPage.value = response.data.page?.number || 0
    totalPages.value = response.data.page?.totalPages || 0
  } catch (error) {
    console.error('Error loading users:', error)
    showNotification({
      type: 'error',
      message: getErrorMessage(error, 'Ошибка загрузки пользователей')
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    banned: '',
    roleName: ''
  }
  loadUsers()
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

const viewUser = (userId) => {
  router.push({ name: 'AdminUserDetails', params: { id: userId } })
}

const banUser = async (userId) => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Подтверждение блокировки',
    message: 'Вы уверены, что хотите заблокировать этого пользователя? Он потеряет доступ к системе.'
  })
  
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/users/${userId}/ban`)
    await loadUsers(currentPage.value)
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

const unbanUser = async (userId) => {
  const confirmed = await showConfirm({
    type: 'info',
    title: 'Подтверждение разблокировки',
    message: 'Вы уверены, что хотите разблокировать этого пользователя? Он снова получит доступ к системе.'
  })
  
  if (!confirmed) return
  
  try {
    await api.patch(`/admin/users/${userId}/unban`)
    await loadUsers(currentPage.value)
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

const openRoleModal = (user) => {
  selectedUser.value = user
  newRole.value = user.roleName
  showRoleModal.value = true
  roleError.value = ''
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
  newRole.value = ''
  roleError.value = ''
}

const updateRole = async () => {
  updatingRole.value = true
  roleError.value = ''
  
  try {
    await api.patch(`/admin/users/${selectedUser.value.id}/updateRole`, {
      RoleName: newRole.value
    })
    await loadUsers(currentPage.value)
    closeRoleModal()
  } catch (error) {
    roleError.value = getErrorMessage(error, 'Ошибка изменения роли')
  } finally {
    updatingRole.value = false
  }
}

const goToPage = (page) => {
  loadUsers(page)
}

onMounted(() => {
  loadUsers()
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
