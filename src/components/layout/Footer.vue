<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-xl font-bold text-gray-900">CarShare</span>
          </div>
          <p class="text-sm text-gray-600">
            Современная платформа для аренды автомобилей. 
            Быстро, удобно, надежно.
          </p>
        </div>

        <!-- Links -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Навигация</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Каталог автомобилей
              </router-link>
            </li>
            <li>
              <router-link to="/contracts" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Мои договоры
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Профиль
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Поддержка</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Условия использования
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Политика конфиденциальности
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Служба поддержки
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-center text-gray-500">
          &copy; {{ new Date().getFullYear() }} CarShare. Все права защищены.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup></script>
