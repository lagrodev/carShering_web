<!-- Пример использования аутентификации в компонентах -->

<!-- 
  ПРИМЕР 1: Условный рендеринг на основе аутентификации
  Показываем разный контент для авторизованных и неавторизованных пользователей
-->
<template>
  <div class="example-1">
    <h2>Пример 1: Условный рендеринг</h2>
    
    <!-- Для гостей -->
    <div v-if="!authStore.isAuthenticated">
      <p>Войдите, чтобы получить доступ к функциям</p>
      <router-link to="/auth">Войти</router-link>
    </div>
    
    <!-- Для авторизованных -->
    <div v-else>
      <p>Добро пожаловать, {{ authStore.username }}!</p>
      <button @click="authStore.logout()">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
</script>

<!-- 
  ПРИМЕР 2: Проверка роли администратора
  Показываем кнопки управления только для админов
-->
<template>
  <div class="example-2">
    <h2>Пример 2: Проверка роли</h2>
    
    <div class="item-card">
      <h3>Товар #1</h3>
      
      <!-- Обычные действия для всех -->
      <button>Просмотр</button>
      
      <!-- Административные действия только для админов -->
      <template v-if="authStore.isAdmin">
        <button @click="editItem">Редактировать</button>
        <button @click="deleteItem" class="danger">Удалить</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()

const editItem = () => {
  console.log('Редактирование...')
}

const deleteItem = () => {
  if (confirm('Удалить?')) {
    console.log('Удаление...')
  }
}
</script>

<!-- 
  ПРИМЕР 3: Загрузка данных после аутентификации
  Автоматически загружаем пользовательские данные после входа
-->
<template>
  <div class="example-3">
    <h2>Пример 3: Загрузка данных</h2>
    
    <div v-if="authStore.loading">
      Загрузка...
    </div>
    
    <div v-else-if="userContracts">
      <h3>Мои договоры ({{ userContracts.length }})</h3>
      <ul>
        <li v-for="contract in userContracts" :key="contract.id">
          {{ contract.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const userContracts = ref(null)

// Загружаем данные при монтировании, если пользователь авторизован
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadContracts()
  }
})

// Наблюдаем за изменением статуса аутентификации
watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth) {
    await loadContracts()
  } else {
    userContracts.value = null
  }
})

async function loadContracts() {
  try {
    const response = await api.get('/contracts')
    userContracts.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки договоров:', error)
  }
}
</script>

<!-- 
  ПРИМЕР 4: Защита действий с проверкой прав
  Выполняем действия только если у пользователя есть права
-->
<template>
  <div class="example-4">
    <h2>Пример 4: Защита действий</h2>
    
    <button @click="createContract">Создать договор</button>
    <button @click="deleteAllContracts" v-if="authStore.isAdmin">
      Удалить все договоры (Админ)
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

async function createContract() {
  // Проверяем аутентификацию
  if (!authStore.isAuthenticated) {
    alert('Войдите, чтобы создать договор')
    router.push('/auth')
    return
  }
  
  try {
    const response = await api.post('/contracts', {
      // данные договора
    })
    console.log('Договор создан:', response.data)
  } catch (error) {
    console.error('Ошибка создания:', error)
  }
}

async function deleteAllContracts() {
  // Двойная проверка прав (на всякий случай)
  if (!authStore.isAdmin) {
    alert('Недостаточно прав')
    return
  }
  
  if (!confirm('Удалить ВСЕ договоры? Это действие нельзя отменить!')) {
    return
  }
  
  try {
    await api.delete('/admin/contracts/all')
    alert('Все договоры удалены')
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
}
</script>

<!-- 
  ПРИМЕР 5: Отображение информации о пользователе
  Профиль пользователя с редактированием
-->
<template>
  <div class="example-5">
    <h2>Пример 5: Профиль пользователя</h2>
    
    <div v-if="authStore.user" class="profile-card">
      <div class="avatar">
        {{ authStore.username.charAt(0).toUpperCase() }}
      </div>
      
      <div class="info">
        <h3>{{ authStore.username }}</h3>
        <p>Email: {{ authStore.user.email }}</p>
        
        <div class="roles">
          <span 
            v-for="role in authStore.userRoles" 
            :key="role"
            class="badge"
          >
            {{ role.replace('ROLE_', '') }}
          </span>
        </div>
      </div>
      
      <div class="actions">
        <button @click="editProfile">Редактировать профиль</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function editProfile() {
  router.push('/profile/edit')
}
</script>

<style scoped>
.profile-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
}

.roles {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.badge {
  padding: 4px 12px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
</style>

<!-- 
  ПРИМЕР 6: Хук для проверки аутентификации
  Переиспользуемая логика
-->
<script>
// composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push('/auth')
      return false
    }
    return true
  }
  
  const requireAdmin = () => {
    if (!authStore.isAdmin) {
      alert('Требуются права администратора')
      return false
    }
    return true
  }
  
  const hasRole = (role) => {
    return authStore.userRoles.includes(role)
  }
  
  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    username: computed(() => authStore.username),
    requireAuth,
    requireAdmin,
    hasRole,
    login: authStore.login,
    logout: authStore.logout
  }
}
</script>

<!-- Использование хука -->
<template>
  <div class="example-6">
    <h2>Пример 6: Использование хука</h2>
    
    <button @click="doSomething">Защищенное действие</button>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { requireAuth, username } = useAuth()

function doSomething() {
  if (!requireAuth()) return
  
  console.log(`Выполняется от имени ${username.value}`)
}
</script>

<!-- 
  ПРИМЕР 7: Форма с обработкой ошибок
  Правильная обработка ошибок при входе
-->
<template>
  <div class="example-7">
    <h2>Пример 7: Обработка ошибок</h2>
    
    <form @submit.prevent="handleLogin">
      <div v-if="authStore.error" class="error">
        {{ authStore.error }}
        <button @click="authStore.clearError">✕</button>
      </div>
      
      <input v-model="username" placeholder="Логин" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await authStore.login({
      username: username.value,
      password: password.value
    })
    router.push('/')
  } catch (error) {
    // Ошибка уже обработана в store
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.error {
  padding: 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error button {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 18px;
}
</style>
