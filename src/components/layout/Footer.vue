<template>
  <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mt-auto relative overflow-hidden">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center space-x-3 group">
            <div class="relative">
              <div class="absolute inset-0 bg-primary-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">CarShare</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            Современная платформа для аренды автомобилей. Быстро, удобно, надежно.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="group relative">
              <div class="absolute inset-0 bg-primary-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div class="relative bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 transform group-hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </a>
            <a href="#" class="group relative">
              <div class="absolute inset-0 bg-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div class="relative bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 transform group-hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
            </a>
            <a href="#" class="group relative">
              <div class="absolute inset-0 bg-pink-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div class="relative bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 transform group-hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <svg class="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Навигация
          </h3>
          <ul class="space-y-3">
            <li>
              <router-link to="/" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Каталог автомобилей</span>
              </router-link>
            </li>
            <li>
              <router-link to="/contracts" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Мои договоры</span>
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Профиль</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support Section -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <svg class="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Поддержка
          </h3>
          <ul class="space-y-3">
            <li>
              <button @click="showTermsModal = true" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200 text-left">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Условия использования</span>
              </button>
            </li>
            <li>
              <button @click="showPrivacyModal = true" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200 text-left">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Политика конфиденциальности</span>
              </button>
            </li>
            <li>
              <button @click="showSupportModal = true" class="group flex items-center text-gray-400 hover:text-white transition-all duration-200 text-left">
                <svg class="w-4 h-4 mr-3 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-200">Служба поддержки</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} <span class="text-white font-semibold">CarShare</span>. Все права защищены.
          </p>
          <div class="flex items-center space-x-6 text-sm">
            <a href="mailto:support@carshare.com" class="text-gray-400 hover:text-white transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@carshare.com
            </a>
            <a href="tel:+79001234567" class="text-gray-400 hover:text-white transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (900) 123-45-67
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <Transition name="modal">
      <div v-if="showTermsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click="showTermsModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white flex items-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Условия использования
              </h3>
              <button @click="showTermsModal = false" class="text-white/80 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4 text-gray-700">
            <p>Добро пожаловать в CarShare! Используя наш сервис, вы соглашаетесь со следующими условиями:</p>
            <div class="space-y-3">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">1. Общие положения</h4>
                <p class="text-sm">Настоящие условия регулируют использование платформы CarShare для аренды автомобилей.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">2. Регистрация и аккаунт</h4>
                <p class="text-sm">При регистрации вы обязуетесь предоставить достоверную информацию и поддерживать её актуальность.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">3. Аренда автомобилей</h4>
                <p class="text-sm">Для аренды необходимы действующие водительские права и соблюдение правил дорожного движения.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">4. Оплата</h4>
                <p class="text-sm">Оплата производится согласно тарифам, указанным на сайте. Возможны дополнительные сборы за нарушения.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Privacy Modal -->
    <Transition name="modal">
      <div v-if="showPrivacyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click="showPrivacyModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white flex items-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Политика конфиденциальности
              </h3>
              <button @click="showPrivacyModal = false" class="text-white/80 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4 text-gray-700">
            <p>Мы серьезно относимся к защите ваших персональных данных. Наша политика конфиденциальности:</p>
            <div class="space-y-3">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Сбор информации</h4>
                <p class="text-sm">Мы собираем только необходимую информацию для предоставления услуг аренды автомобилей.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Использование данных</h4>
                <p class="text-sm">Ваши данные используются для обработки заказов, улучшения сервиса и коммуникации с вами.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Защита информации</h4>
                <p class="text-sm">Мы применяем современные методы шифрования и защиты для обеспечения безопасности ваших данных - наша защита надежна и соответствует международным стандартам (ее нет) </p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Ваши права</h4>
                <p class="text-sm">Вы имеете право на доступ, исправление и удаление своих персональных данных.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Support Modal -->
    <Transition name="modal">
      <div v-if="showSupportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click="showSupportModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full" @click.stop>
          <div class="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white flex items-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Служба поддержки
              </h3>
              <button @click="showSupportModal = false" class="text-white/80 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <p class="text-gray-700">Мы всегда готовы помочь! Свяжитесь с нами удобным способом:</p>
            <div class="space-y-4">
              <a href="mailto:support@carshare.com" class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                <div class="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="font-semibold text-gray-900">Email</p>
                  <p class="text-sm text-gray-600">support@carshare.com</p>
                </div>
              </a>
              <a href="tel:+79001234567" class="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                <div class="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="font-semibold text-gray-900">Телефон</p>
                  <p class="text-sm text-gray-600">+7 (900) 123-45-67</p>
                </div>
              </a>
              <div class="flex items-center p-4 bg-gray-50 rounded-xl">
                <div class="bg-purple-100 p-3 rounded-lg">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="font-semibold text-gray-900">Режим работы</p>
                  <p class="text-sm text-gray-600">Круглосуточно, 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const showSupportModal = ref(false)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
