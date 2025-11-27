<template>
  <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ title }}</h3>
          <p class="text-gray-500 text-sm">{{ subtitle }}</p>
        </div>
      </div>
      
      <!-- Toggle View -->
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          @click="viewMode = 'list'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            viewMode === 'list' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          @click="viewMode = 'chart'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            viewMode === 'chart' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <!-- Skeleton loader -->
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 bg-white animate-pulse"
      >
        <div class="w-12 h-12 rounded-full bg-gray-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div class="space-y-2">
          <div class="h-6 bg-gray-200 rounded w-12"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!stats || stats.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p class="text-gray-600">Нет данных для отображения</p>
    </div>

    <!-- Content Container with min-height to prevent CLS -->
    <div v-else class="min-h-[400px]">
    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-3">
      <div
        v-for="(user, index) in stats"
        :key="user.userId"
        class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
        :class="[
          index === 0 ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' :
          index === 1 ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50' :
          index === 2 ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50' :
          'border-gray-200 bg-white hover:border-primary-300'
        ]"
      >
        <!-- Rank Badge -->
        <div class="flex-shrink-0">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            :class="[
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
              index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
              'bg-gray-100 text-gray-700'
            ]"
          >
            <span v-if="index < 3">
              <svg v-if="index === 0" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span v-else>{{ index + 1 }}</span>
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 truncate">{{ user.login }}</h4>
          <p class="text-sm text-gray-500">ID: {{ user.userId }}</p>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-6 text-sm">
          <div class="text-center">
            <div class="font-bold text-xl text-primary-600">{{ user.ridesCount }}</div>
            <div class="text-gray-500">поездок</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-xl text-purple-600">{{ user.totalHours.toFixed(1) }}</div>
            <div class="text-gray-500">часов</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart View -->
    <div v-else class="py-4">
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <!-- Pie Chart -->
        <div class="flex-1 flex items-center justify-center min-h-[280px]">
          <svg :width="chartSize" :height="chartSize" viewBox="0 0 200 200" class="transform -rotate-90">
            <circle
              v-for="(segment, index) in chartSegments"
              :key="index"
              cx="100"
              cy="100"
              r="80"
              fill="none"
              :stroke="getColor(index)"
              stroke-width="40"
              :stroke-dasharray="`${segment.length} ${circumference}`"
              :stroke-dashoffset="-segment.offset"
              class="transition-all duration-300 hover:opacity-80"
            />
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex-1 space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="(user, index) in stats.slice(0, 10)"
            :key="user.userId"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              class="w-4 h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: getColor(index) }"
            ></div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">{{ user.login }}</div>
              <div class="text-sm text-gray-500">
                {{ user.totalHours.toFixed(1) }} часов ({{ user.ridesCount }} поездок)
              </div>
            </div>
            <div class="text-sm font-semibold text-gray-700">
              {{ getHoursPercentage(user.totalHours) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  fetchFunction: {
    type: Function,
    required: true
  }
})

const stats = ref([])
const loading = ref(true)
const error = ref(null)
const viewMode = ref('list')
const chartSize = 280

const colors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
  '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

const totalRides = computed(() => {
  return stats.value.reduce((sum, user) => sum + user.ridesCount, 0)
})

const totalHours = computed(() => {
  return stats.value.reduce((sum, user) => sum + user.totalHours, 0)
})

const circumference = computed(() => 2 * Math.PI * 80)

const chartSegments = computed(() => {
  let offset = 0
  return stats.value.slice(0, 10).map(user => {
    const percentage = (user.totalHours / totalHours.value)
    const length = percentage * circumference.value
    const segment = { offset, length }
    offset += length
    return segment
  })
})

const getColor = (index) => {
  return colors[index % colors.length]
}

const getPercentage = (rides) => {
  return ((rides / totalRides.value) * 100).toFixed(1)
}

const getHoursPercentage = (hours) => {
  return ((hours / totalHours.value) * 100).toFixed(1)
}

const loadStats = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await props.fetchFunction({ page: 0, size: 10 })
    stats.value = response.content || []
  } catch (err) {
    console.error('Error loading leaderboard:', err)
    error.value = 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>
