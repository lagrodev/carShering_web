<template>
  <header class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link 
          to="/" 
          class="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
        >
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>CarShare</span>
        </router-link>

        <!-- Navigation -->
        <nav class="flex items-center gap-2" v-if="!authStore.loading">
          <!-- Catalog Link (Always visible) -->
          <router-link 
            to="/" 
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all"
            active-class="text-primary-600 bg-primary-50"
          >
            Каталог
          </router-link>

          <!-- Contracts Link (with guest protection) -->
          <button
            v-if="!authStore.isAuthenticated"
            @click="showGuestMessage('contracts')"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Мои договоры
          </button>
          <router-link 
            v-else
            to="/contracts" 
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all"
            active-class="text-primary-600 bg-primary-50"
          >
            Мои договоры
          </router-link>

          <!-- Guest: Login Button -->
          <router-link 
            v-if="!authStore.isAuthenticated"
            to="/auth" 
            class="ml-4 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Войти в аккаунт
            </span>
          </router-link>

          <!-- Authenticated: User Dropdown Menu -->
          <div v-else class="relative ml-4" ref="dropdownRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <span class="text-sm font-bold text-white">
                  {{ authStore.username?.[0]?.toUpperCase() || 'U' }}
                </span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ authStore.username }}</span>
              <svg 
                class="w-4 h-4 text-gray-500 transition-transform duration-200" 
                :class="{ 'rotate-180': isDropdownOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isDropdownOpen"
                class="user-dropdown absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 overflow-hidden"
              >
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ authStore.username }}</p>
                  <p class="text-xs text-gray-500 mt-1">@{{ authStore.username }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <router-link
                    to="/profile"
                    @click="isDropdownOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Мой профиль
                  </router-link>

                  <router-link
                    v-if="authStore.isAdmin"
                    to="/admin"
                    @click="isDropdownOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Админ панель
                  </router-link>
                </div>

                <!-- Logout -->
                <div class="border-t border-gray-100 pt-1">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </nav>

        <!-- Loading State -->
        <div v-else class="flex items-center gap-2 text-gray-400">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm">Загрузка...</span>
        </div>
      </div>
    </div>

    <!-- Guest Message Toast -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="guestMessage"
        class="fixed top-20 right-4 bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 max-w-sm z-50"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-amber-900">Требуется авторизация</h4>
            <p class="text-sm text-amber-800 mt-1">{{ guestMessage }}</p>
            <button
              @click="router.push('/auth')"
              class="mt-3 text-sm font-medium text-amber-700 hover:text-amber-800 underline"
            >
              Войти в систему →
            </button>
          </div>
          <button
            @click="guestMessage = ''"
            class="text-amber-400 hover:text-amber-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const guestMessage = ref('')

const handleLogout = async () => {
  try {
    isDropdownOpen.value = false
    await authStore.logout()
    router.push('/auth')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

const showGuestMessage = (type) => {
  if (type === 'contracts') {
    guestMessage.value = 'Зарегистрируйтесь, чтобы просмотреть ваши договоры.'
  }
  
  // Автоматически скрыть через 5 секунд
  setTimeout(() => {
    guestMessage.value = ''
  }, 5000)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(async () => {
  // Тихо проверяем авторизацию, но не форсируем её
  if (!authStore.user && !authStore.loading) {
    try {
      await authStore.checkAuth()
    } catch (err) {
      // Игнорируем ошибки - пользователь может быть гостем
      console.log('User is guest')
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-dropdown {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
