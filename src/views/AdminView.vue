<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style="min-height: 600px;">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Панель администратора
            </h1>
            <p class="mt-2 text-gray-600">Управление автомобилями и моделями</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex gap-2 overflow-x-auto">
            <button
              @click="activeTab = 'cars'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'cars'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Автомобили
              </span>
            </button>
            <button
              @click="activeTab = 'models'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'models'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Модели
              </span>
            </button>
            <button
              @click="activeTab = 'contracts'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'contracts'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Контракты
              </span>
            </button>
            <button
              @click="activeTab = 'clients'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'clients'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Клиенты
              </span>
            </button>
            <button
              @click="activeTab = 'documents'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'documents'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Документы
              </span>
            </button>
            <button
              @click="activeTab = 'filters'"
              :class="[
                'py-3 px-6 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === 'filters'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Справочники
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <!-- Cars Tab -->
        <div v-if="activeTab === 'cars'">
          <CarsManagement />
        </div>

        <!-- Models Tab -->
        <div v-if="activeTab === 'models'">
          <ModelsManagement />
        </div>

        <!-- Contracts Tab -->
        <div v-if="activeTab === 'contracts'">
          <ContractsManagement />
        </div>

        <!-- Clients Tab -->
        <div v-if="activeTab === 'clients'">
          <ClientsManagement />
        </div>

        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'">
          <DocumentsManagement />
        </div>

        <!-- Filters Tab -->
        <div v-if="activeTab === 'filters'">
          <FiltersManagement />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import CarsManagement from '../components/admin/CarsManagement.vue'
import ModelsManagement from '../components/admin/ModelsManagement.vue'
import ContractsManagement from '../components/admin/ContractsManagement.vue'
import ClientsManagement from '../components/admin/ClientsManagement.vue'
import DocumentsManagement from '../components/admin/DocumentsManagement.vue'
import FiltersManagement from '../components/admin/FiltersManagement.vue'

const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('cars')

onMounted(async () => {
  // Проверяем права администратора
  if (!authStore.isAdmin) {
    router.push('/')
  }
})
</script>
