<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-5xl">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div class="flex flex-col md:flex-row" style="min-height: 650px;">
          
          <!-- LEFT PANEL: Login Form (always on left) -->
          <div class="w-full md:w-1/2 relative overflow-hidden border-r border-gray-200">
            <Transition name="slide-left" mode="out-in">
              <!-- Login Form -->
              <div v-if="activeTab === 'login'" key="login-active" class="p-8 md:p-10 h-full flex flex-col justify-center">
                <div class="space-y-6 max-w-sm mx-auto w-full">
                  <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-600 mb-4 shadow-sm">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Вход</h2>
                    <p class="mt-1 text-sm text-gray-600">Войдите в свой аккаунт</p>
                  </div>
                  
                  <Transition name="fade-scale">
                    <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <div class="flex items-start">
                        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <span>{{ authStore.error }}</span>
                      </div>
                    </div>
                  </Transition>

                  <form @submit.prevent="handleLogin" class="space-y-5">
                    <div>
                      <label for="login-username" class="block text-sm font-medium text-gray-700 mb-2">Логин</label>
                      <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="login-username"
                          v-model="loginForm.username"
                          type="text"
                          placeholder="Введите логин"
                          required
                          autocomplete="username"
                          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                      <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          id="login-password"
                          v-model="loginForm.password"
                          :type="showLoginPassword ? 'text' : 'password'"
                          placeholder="Введите пароль"
                          required
                          autocomplete="current-password"
                          class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                        />
                        <button
                          type="button"
                          @click="showLoginPassword = !showLoginPassword"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg v-if="showLoginPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      :disabled="authStore.loading"
                      class="w-full inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md px-6 py-3 text-lg"
                    >
                      <span v-if="authStore.loading" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Вход...
                      </span>
                      <span v-else>Войти</span>
                    </button>
                  </form>

                  <div class="text-center mt-6">
                    <p class="text-sm text-gray-600">
                      Нет аккаунта? 
                      <button @click="switchTab('register')" class="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                        Зарегистрироваться
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Login Inactive (when register is active) -->
              <div v-else key="login-inactive" class="p-8 md:p-10 h-full flex flex-col items-center justify-center bg-gray-50">
                <div class="text-center max-w-sm">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-600 mb-5 shadow-sm">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-3">Уже с нами?</h2>
                  <p class="text-gray-600 mb-6 leading-relaxed">
                    Войдите в свой аккаунт и продолжайте пользоваться всеми возможностями сервиса
                  </p>
                  <button
                    @click="switchTab('login')"
                    class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md px-6 py-3 text-lg"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Войти
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- RIGHT PANEL: Register Form (always on right) -->
          <div class="w-full md:w-1/2 relative overflow-hidden">
            <Transition name="slide-right" mode="out-in">
              <!-- Register Form -->
              <div v-if="activeTab === 'register'" key="register-active" class="p-8 md:p-10 h-full flex flex-col justify-center">
                <div class="space-y-4 max-w-sm mx-auto w-full">
                  <div class="text-center mb-4">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-600 mb-4 shadow-sm">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Регистрация</h2>
                    <p class="mt-1 text-sm text-gray-600">Создайте новый аккаунт</p>
                  </div>
                  
                  <Transition name="fade-scale">
                    <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <div class="flex items-start">
                        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <span>{{ authStore.error }}</span>
                      </div>
                    </div>
                  </Transition>

                  <Transition name="fade-scale">
                    <div v-if="registerSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                      <div class="flex items-start">
                        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>Успешно! Переключаемся...</span>
                      </div>
                    </div>
                  </Transition>

                  <form @submit.prevent="handleRegister" class="space-y-4">
                    <div>
                      <label for="reg-login" class="block text-sm font-medium text-gray-700 mb-2">
                        Логин <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-login"
                        v-model="registerForm.login"
                        type="text"
                        placeholder="От 6 до 50 символов"
                        required
                        minlength="6"
                        maxlength="50"
                        autocomplete="username"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label for="reg-email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-email"
                        v-model="registerForm.email"
                        type="email"
                        placeholder="example@mail.com"
                        required
                        autocomplete="email"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label for="reg-lastname" class="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-lastname"
                        v-model="registerForm.lastName"
                        type="text"
                        placeholder="Введите фамилию"
                        required
                        autocomplete="family-name"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-2">
                        Пароль <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          id="reg-password"
                          v-model="registerForm.password"
                          :type="showRegPassword ? 'text' : 'password'"
                          placeholder="Минимум 6 символов"
                          required
                          minlength="6"
                          autocomplete="new-password"
                          class="block w-full px-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                        />
                        <button
                          type="button"
                          @click="showRegPassword = !showRegPassword"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg v-if="showRegPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label for="reg-password-confirm" class="block text-sm font-medium text-gray-700 mb-2">
                        Подтверждение <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          id="reg-password-confirm"
                          v-model="registerForm.confirmPassword"
                          :type="showRegConfirmPassword ? 'text' : 'password'"
                          placeholder="Повторите пароль"
                          required
                          minlength="6"
                          autocomplete="new-password"
                          class="block w-full px-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-400"
                        />
                        <button
                          type="button"
                          @click="showRegConfirmPassword = !showRegConfirmPassword"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg v-if="showRegConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      :disabled="authStore.loading"
                      class="w-full inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md px-6 py-3 text-lg mt-2"
                    >
                      <span v-if="authStore.loading" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Регистрация...
                      </span>
                      <span v-else>Зарегистрироваться</span>
                    </button>
                  </form>

                  <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">
                      Уже есть аккаунт? 
                      <button @click="switchTab('login')" class="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                        Войти
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Register Inactive (when login is active) -->
              <div v-else key="register-inactive" class="p-8 md:p-10 h-full flex flex-col items-center justify-center bg-gray-50">
                <div class="text-center max-w-sm">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-600 mb-5 shadow-sm">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-3">Впервые здесь?</h2>
                  <p class="text-gray-600 mb-6 leading-relaxed">
                    Зарегистрируйтесь и получите доступ ко всем возможностям нашего сервиса
                  </p>
                  <button
                    @click="switchTab('register')"
                    class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md px-6 py-3 text-lg"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Зарегистрироваться
                  </button>
                </div>
              </div>
            </Transition>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('login')
const registerSuccess = ref(false)

const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const showRegConfirmPassword = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  login: '',
  email: '',
  lastName: '',
  password: '',
  confirmPassword: ''
})

const switchTab = (tab) => {
  authStore.clearError()
  registerSuccess.value = false
  activeTab.value = tab
}

const handleLogin = async () => {
  authStore.clearError()
  try {
    await authStore.login(loginForm.value)
    router.push('/')
  } catch (error) {
    // Error set by store
  }
}

const handleRegister = async () => {
  authStore.clearError()
  
  if (registerForm.value.login.length < 6 || registerForm.value.login.length > 50) {
    authStore.error = 'Логин должен содержать от 6 до 50 символов'
    return
  }
  
  if (registerForm.value.password.length < 6) {
    authStore.error = 'Пароль должен содержать минимум 6 символов'
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    authStore.error = 'Пароли не совпадают'
    return
  }
  
  if (!registerForm.value.lastName.trim()) {
    authStore.error = 'Фамилия обязательна для заполнения'
    return
  }

  try {
    await authStore.register({
      login: registerForm.value.login,
      email: registerForm.value.email,
      lastName: registerForm.value.lastName,
      password: registerForm.value.password
    })
    
    registerSuccess.value = true
    setTimeout(() => {
      activeTab.value = 'login'
      loginForm.value.username = registerForm.value.login
      registerSuccess.value = false
    }, 2000)
  } catch (error) {
    // Error set by store
  }
}
</script>

<style scoped>
/* Left panel - slides from/to left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Right panel - slides from/to right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Fade with scale for messages */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>