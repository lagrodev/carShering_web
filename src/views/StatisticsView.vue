<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import UserStatsCard from '../components/profile/UserStatsCard.vue'
import LeaderboardCard from '../components/profile/LeaderboardCard.vue'
import { getRideStatsLastMonth, getRideStatsAllTime } from '../services/analyticsService'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Проверяем авторизацию
  if (!authStore.isAuthenticated) {
    await router.push('/auth')
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4 mb-4">
          <button
            @click="router.back()"
            class="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-4xl md:text-5xl font-bold">Моя статистика</h1>
            <p class="text-primary-100 mt-2 text-lg">Ваши достижения и активность в сервисе</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-1 h-8 bg-gradient-to-b from-primary-600 to-purple-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">Обзор активности</h2>
        </div>
        <p class="text-gray-600 ml-7 max-w-3xl">
          Здесь вы можете отслеживать свою историю использования, предпочтения и статистику по аренде автомобилей
        </p>
      </div>

      <!-- Statistics Card -->
      <UserStatsCard />

      <!-- Leaderboards Section -->
      <div class="mt-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">Рейтинг пользователей</h2>
        </div>
        
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <!-- Last Month Leaderboard -->
          <LeaderboardCard
            title="Топ за месяц"
            subtitle="Самые активные пользователи за последний месяц"
            :fetch-function="getRideStatsLastMonth"
          />

          <!-- All Time Leaderboard -->
          <LeaderboardCard
            title="Топ за все время"
            subtitle="Лидеры по количеству поездок"
            :fetch-function="getRideStatsAllTime"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          to="/contracts"
          class="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Мои договоры</h3>
              <p class="text-sm text-gray-500">Управление арендой</p>
            </div>
          </div>
          <div class="flex items-center text-primary-600 text-sm font-semibold">
            Перейти
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </router-link>

        <router-link
          to="/favorites"
          class="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Избранное</h3>
              <p class="text-sm text-gray-500">Любимые автомобили</p>
            </div>
          </div>
          <div class="flex items-center text-primary-600 text-sm font-semibold">
            Перейти
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </router-link>

        <router-link
          to="/"
          class="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Каталог</h3>
              <p class="text-sm text-gray-500">Найти автомобиль</p>
            </div>
          </div>
          <div class="flex items-center text-primary-600 text-sm font-semibold">
            Перейти
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </router-link>
      </div>
    </main>

    <Footer />
  </div>
</template>
