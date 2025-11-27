<template>
  <div class="space-y-6">
    <!-- Overview Statistics -->
    <div v-if="overview" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Revenue -->
      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Всего</span>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold">{{ formatCurrency(overview.profit) }}</p>
          <p class="text-green-100 text-sm">Общая выручка</p>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <span class="text-sm">За месяц:</span>
            <span class="font-semibold">{{ formatCurrency(overview.profitThisMonth) }}</span>
          </div>
        </div>
      </div>

      <!-- Total Contracts -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Всего</span>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold">{{ overview.allContracts }}</p>
          <p class="text-blue-100 text-sm">Контрактов</p>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <span class="text-sm">За месяц:</span>
            <span class="font-semibold">{{ overview.allContractsMonth }}</span>
          </div>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Всего</span>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold">{{ overview.totalUsers }}</p>
          <p class="text-purple-100 text-sm">Пользователей</p>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <span class="text-sm">Активных:</span>
            <span class="font-semibold">{{ overview.totalActiveUsers }}</span>
          </div>
        </div>
      </div>

      <!-- Total Cars -->
      <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Всего</span>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold">{{ overview.totalCars }}</p>
          <p class="text-orange-100 text-sm">Автомобилей</p>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <span class="text-sm">Доступно:</span>
            <span class="font-semibold">{{ overview.totalAvailableCars }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Range Selector -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-1 h-8 bg-gradient-to-b from-primary-600 to-purple-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">Аналитика по периодам</h2>
        </div>
        
        <!-- Quick Date Ranges -->
        <div class="flex gap-2">
          <button
            @click="setDateRange('week')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              quickRange === 'week'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Неделя
          </button>
          <button
            @click="setDateRange('month')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              quickRange === 'month'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Месяц
          </button>
          <button
            @click="setDateRange('quarter')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              quickRange === 'quarter'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Квартал
          </button>
          <button
            @click="setDateRange('year')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              quickRange === 'year'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Год
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Начальная дата</label>
          <input
            type="date"
            v-model="dateFrom"
            :max="dateTo || today"
            @change="onDateChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Конечная дата</label>
          <input
            type="date"
            v-model="dateTo"
            :min="dateFrom"
            :max="today"
            @change="onDateChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          @click="loadDailyRevenue"
          :disabled="loading"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
        >
          <span v-if="!loading">Применить</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </span>
        </button>
      </div>
    </div>

    <!-- Period Summary -->
    <div v-if="dailyData.length > 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
        <h3 class="text-xl font-bold text-gray-900">Статистика за период</h3>
        <span class="text-sm text-gray-600 ml-auto">{{ dailyData.length }} {{ dailyData.length === 1 ? 'день' : dailyData.length < 5 ? 'дня' : 'дней' }}</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600">Общая выручка</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(periodTotalRevenue) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Average Daily Revenue -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600">Средняя за день</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(periodAverageRevenue) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Max Daily Revenue -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600">Максимум за день</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(periodMaxRevenue) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Days with Revenue -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600">Дней с выручкой</p>
              <p class="text-2xl font-bold text-gray-900">{{ periodDaysWithRevenue }}<span class="text-base text-gray-500 ml-1">/ {{ dailyData.length }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View by Months -->
    <div v-if="dailyData.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
          <h3 class="text-xl font-bold text-gray-900">Календарь выручки</h3>
        </div>
        <div class="text-sm text-gray-500">
          Показаны месяцы за выбранный период ({{ dateFrom }} — {{ dateTo }})
        </div>
      </div>
      
      <div class="space-y-8">
        <div v-for="(monthData, monthKey) in calendarByMonths" :key="monthKey" class="space-y-4">
          <!-- Month Header -->
          <div class="flex items-center gap-3">
            <h4 class="text-lg font-bold text-gray-800">{{ monthData.monthName }}</h4>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <!-- Days of Week Header -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div v-for="dayName in ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']" :key="dayName" class="text-center text-xs font-medium text-gray-500 py-1">
              {{ dayName }}
            </div>
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, dayIndex) in monthData.days"
              :key="dayIndex"
              @click="day && day.inRange && selectDay(day)"
              :class="[
                'min-h-[80px] rounded-lg transition-all duration-200 flex flex-col items-center justify-center text-sm font-medium relative p-2',
                day && day.inRange ? 'cursor-pointer' : 'cursor-default',
                day && day.inRange ? getRevenueColor(day.revenue) : 'bg-gray-50',
                day && day.inRange && selectedDate === day.date ? 'ring-2 ring-primary-600 ring-offset-2' : '',
                day && day.inRange ? 'hover:ring-2 hover:ring-primary-400 hover:ring-offset-1' : '',
                !day || !day.inRange ? 'opacity-30' : ''
              ]"
              :title="day && day.inRange ? `${formatDateFull(day.date)}: ${formatCurrency(day.revenue)}` : ''"
            >
              <div v-if="day" class="flex flex-col items-center gap-1">
                <span :class="day.inRange ? 'text-white font-bold' : 'text-gray-400'">{{ day.dayNumber }}</span>
                <span v-if="day.inRange && day.revenue > 0" class="text-[10px] text-white font-semibold">{{ formatCurrency(day.revenue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Legend -->
      <div class="flex items-center gap-4 text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
        <span>Меньше</span>
        <div class="flex gap-1">
          <div class="w-8 h-8 rounded bg-gray-200"></div>
          <div class="w-8 h-8 rounded bg-green-200"></div>
          <div class="w-8 h-8 rounded bg-green-400"></div>
          <div class="w-8 h-8 rounded bg-green-600"></div>
          <div class="w-8 h-8 rounded bg-green-800"></div>
        </div>
        <span>Больше</span>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div v-if="dailyData.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
        <h3 class="text-xl font-bold text-gray-900">График выручки</h3>
      </div>
      
      <div class="h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Top Cars by Profit -->
    <div v-if="topCars.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-gradient-to-b from-yellow-600 to-orange-600 rounded-full"></div>
        <h3 class="text-xl font-bold text-gray-900">Топ автомобилей по прибыли</h3>
      </div>
      
      <div v-if="topCarsLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="(car, index) in topCars"
          :key="car.carId"
          class="group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
          :class="[
            index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' :
            index === 1 ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50' :
            index === 2 ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50' :
            'border-gray-200 bg-white hover:border-primary-300'
          ]"
        >
          <!-- Rank Badge -->
          <div class="absolute top-4 left-4 z-10">
            <div
              class="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-lg"
              :class="[
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              ]"
            >
              {{ index + 1 }}
            </div>
          </div>
          
          <div class="flex items-center gap-6 p-6 pl-20">
            <!-- Car Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h4 class="text-xl font-bold text-gray-900">
                  {{ car.brand }} {{ car.model }}
                </h4>
                <span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  {{ car.carClass }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ car.yearOfIssue }} г.
                </span>
              </div>
              
              <!-- Stats Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 mb-1">Прибыль</span>
                  <span class="text-lg font-bold text-green-600">{{ formatCurrency(car.totalProfit) }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 mb-1">Средний чек</span>
                  <span class="text-lg font-semibold text-blue-600">{{ formatCurrency(car.averageEarnings) }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 mb-1">Клиентов</span>
                  <span class="text-lg font-semibold text-indigo-600">{{ car.uniqueUsersCount }}</span>
                </div>
              </div>
            </div>
            
            <!-- Trophy Icon for Top 3 -->
            <div v-if="index < 3" class="hidden md:flex items-center justify-center">
              <svg
                class="w-16 h-16 opacity-20 group-hover:opacity-30 transition-opacity"
                :class="[
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-500' :
                  'text-orange-500'
                ]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Details Modal -->
    <div
      v-if="showDayDetails"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeDayDetails"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold text-white">
                  Детали за {{ formatDateFull(selectedDate) }}
                </h3>
                <p class="text-sm text-white/80 mt-1">
                  Дата: {{ selectedDate }} | Ожидаемая выручка из календаря: {{ formatCurrency(getRevenueForDate(selectedDate)) }}
                </p>
              </div>
              <button
                @click="closeDayDetails"
                class="text-white hover:text-gray-200 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div v-if="loadingDayDetails" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>

            <div v-else-if="dayContracts.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-4 text-gray-500">Нет контрактов за этот день</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Data Mismatch Warning -->
              <div v-if="Math.abs(dayTotalRevenue - getRevenueForDate(selectedDate)) > 0.01" class="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                <div class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="text-red-900 font-bold mb-1">⚠️ КРИТИЧЕСКОЕ РАСХОЖДЕНИЕ ДАННЫХ</h4>
                    <p class="text-red-800 text-sm mb-2">
                      Сумма в календаре НЕ СОВПАДАЕТ с суммой контрактов!
                    </p>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="bg-white/50 rounded p-2">
                        <p class="text-red-700 font-medium">В календаре:</p>
                        <p class="text-red-900 font-bold text-lg">{{ formatCurrency(getRevenueForDate(selectedDate)) }}</p>
                      </div>
                      <div class="bg-white/50 rounded p-2">
                        <p class="text-red-700 font-medium">Сумма контрактов:</p>
                        <p class="text-red-900 font-bold text-lg">{{ formatCurrency(dayTotalRevenue) }}</p>
                      </div>
                    </div>
                    <p class="text-red-700 text-xs mt-2">
                      Разница: {{ formatCurrency(Math.abs(dayTotalRevenue - getRevenueForDate(selectedDate))) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Summary -->
              <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Всего контрактов</p>
                    <p class="text-2xl font-bold text-gray-900">{{ dayContracts.length }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Общая выручка</p>
                    <p class="text-2xl font-bold text-green-600">{{ formatCurrency(dayTotalRevenue) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Общее время</p>
                    <p class="text-2xl font-bold text-blue-600">{{ dayTotalMinutes }} мин</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Средний чек</p>
                    <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(dayAverageRevenue) }}</p>
                  </div>
                </div>
              </div>

              <!-- Contracts List -->
              <div class="space-y-3">
                <div
                  v-for="contract in dayContracts"
                  :key="contract.carId"
                  class="border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="text-lg font-bold text-gray-900">
                          {{ contract.carBrand }} {{ contract.carModel }}
                        </h4>
                        <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          {{ contract.CarClass }}
                        </span>
                      </div>
                      <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <span class="font-medium">Клиент:</span>
                          <span class="ml-1">{{ contract.clientName }} (@{{ contract.login }})</span>
                        </div>
                        <div>
                          <span class="font-medium">Длительность:</span>
                          <span class="ml-1">{{ formatDuration(contract.durationMinutes) }}</span>
                        </div>
                        <div>
                          <span class="font-medium">Начало:</span>
                          <span class="ml-1">{{ formatDateTime(contract.dataStart) }}</span>
                        </div>
                        <div>
                          <span class="font-medium">Окончание:</span>
                          <span class="ml-1">{{ formatDateTime(contract.dataEnd) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right ml-4">
                      <p class="text-2xl font-bold text-green-600">{{ formatCurrency(contract.totalCost) }}</p>
                      <p class="text-sm text-gray-500">ID: {{ contract.carId }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              @click="closeDayDetails"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { getAdminOverview, getDailyRevenue, getContractsByDay } from '../../services/adminService'
import { getTopCarsByProfit } from '../../services/analyticsService'
import { useNotification } from '../../composables/useNotification'

const { showNotification } = useNotification()

// State
const overview = ref(null)
const loading = ref(false)
const dateFrom = ref('')
const dateTo = ref('')
const today = ref(new Date().toISOString().split('T')[0])
const quickRange = ref('month')
const dailyData = ref([])
const selectedDate = ref(null)
const showDayDetails = ref(false)
const loadingDayDetails = ref(false)
const dayContracts = ref([])
const chartCanvas = ref(null)
let chartInstance = null

// Top cars data
const topCars = ref([])
const topCarsLoading = ref(false)

// Helper function to parse date string without timezone issues
const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Helper function to format date to YYYY-MM-DD
const formatLocalDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Computed
const calendarByMonths = computed(() => {
  if (!dailyData.value || dailyData.value.length === 0) return {}
  
  try {
    const firstDate = parseLocalDate(dailyData.value[0].date)
    const lastDate = parseLocalDate(dailyData.value[dailyData.value.length - 1].date)
    
    console.log('\n=== 📅 BUILDING CALENDAR ===')
    console.log('Date range:', dailyData.value[0].date, '→', dailyData.value[dailyData.value.length - 1].date)
    
    if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
      console.error('❌ Invalid dates')
      return {}
    }
    
    const dataByDate = {}
    dailyData.value.forEach(day => {
      dataByDate[day.date] = day
    })
    
    console.log('Total days with data:', Object.keys(dataByDate).length)
    
    const months = {}
    
    // Iterate through each month in the range
    let currentMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
    const lastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1)
    
    while (currentMonth <= lastMonth) {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
      
      // Get month name
      const monthName = currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      
      // Get first day of month and last day of month
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)
      
      const days = []
      
      // Add empty cells for days before the first day of the month
      const startDayOfWeek = firstDayOfMonth.getDay()
      for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDate = new Date(firstDayOfMonth)
        emptyDate.setDate(emptyDate.getDate() - (startDayOfWeek - i))
        days.push({
          dayNumber: emptyDate.getDate(),
          date: formatLocalDate(emptyDate),
          revenue: 0,
          inRange: false
        })
      }
      
      // Add all days of the month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(year, month, day)
        const dateStr = formatLocalDate(currentDate)
        const dayData = dataByDate[dateStr]
        const inRange = currentDate >= firstDate && currentDate <= lastDate
        
        const dayObj = {
          dayNumber: day,
          date: dateStr,
          revenue: dayData ? dayData.revenue : 0,
          inRange: inRange
        }
        
        days.push(dayObj)
      }
      
      // Add empty cells to complete the last week
      const remainingDays = 7 - (days.length % 7)
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const emptyDate = new Date(lastDayOfMonth)
          emptyDate.setDate(emptyDate.getDate() + i)
          days.push({
            dayNumber: emptyDate.getDate(),
            date: formatLocalDate(emptyDate),
            revenue: 0,
            inRange: false
          })
        }
      }
      
      months[monthKey] = {
        monthName,
        days
      }
      
      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }
    
    console.log('Built', Object.keys(months).length, 'month(s):', Object.keys(months).join(', '))
    return months
  } catch (error) {
    console.error('❌ Calendar error:', error)
    return {}
  }
})

const dayTotalRevenue = computed(() => {
  if (!dayContracts.value || dayContracts.value.length === 0) return 0
  const total = dayContracts.value.reduce((sum, c) => sum + (Number(c.totalCost) || 0), 0)
  return total
})

const dayTotalMinutes = computed(() => {
  if (!dayContracts.value || dayContracts.value.length === 0) return 0
  const total = dayContracts.value.reduce((sum, c) => sum + (Number(c.durationMinutes) || 0), 0)
  return total
})

const dayAverageRevenue = computed(() => {
  if (!dayContracts.value || dayContracts.value.length === 0) return 0
  return dayTotalRevenue.value / dayContracts.value.length
})

// Period statistics
const periodTotalRevenue = computed(() => {
  if (!dailyData.value || dailyData.value.length === 0) return 0
  return dailyData.value.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0)
})

const periodAverageRevenue = computed(() => {
  if (!dailyData.value || dailyData.value.length === 0) return 0
  return periodTotalRevenue.value / dailyData.value.length
})

const periodDaysWithRevenue = computed(() => {
  if (!dailyData.value || dailyData.value.length === 0) return 0
  return dailyData.value.filter(d => d.revenue > 0).length
})

const periodMaxRevenue = computed(() => {
  if (!dailyData.value || dailyData.value.length === 0) return 0
  return Math.max(...dailyData.value.map(d => Number(d.revenue) || 0))
})

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateStr) => {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateFull = (dateStr) => {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours} ч ${mins} мин` : `${mins} мин`
}

const getDayOfWeek = (dateStr) => {
  const date = parseLocalDate(dateStr)
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return days[date.getDay()]
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const getRevenueColor = (revenue) => {
  // Проверка на undefined, null или 0
  if (revenue === undefined || revenue === null || revenue === 0) {
    return 'bg-gray-200 text-gray-400'
  }
  
  // Получаем все revenue > 0 для правильного расчета максимума
  const revenues = dailyData.value.map(d => d.revenue).filter(r => r > 0)
  if (revenues.length === 0) return 'bg-gray-200 text-gray-400'
  
  const max = Math.max(...revenues)
  const min = Math.min(...revenues)
  
  // Если все значения одинаковые
  if (max === min) {
    return 'bg-green-600 text-white'
  }
  
  // Нормализация относительно диапазона (0 to 1)
  const ratio = (revenue - min) / (max - min)
  
  // Более точное распределение цветов
  if (ratio <= 0.2) return 'bg-green-200 text-green-900'
  if (ratio <= 0.4) return 'bg-green-400 text-white'
  if (ratio <= 0.6) return 'bg-green-600 text-white'
  if (ratio <= 0.8) return 'bg-green-700 text-white'
  return 'bg-green-800 text-white'
}

const setDateRange = (range) => {
  console.log('\n=== 📆 DATE RANGE SELECTED: ' + range.toUpperCase() + ' ===')
  
  quickRange.value = range
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const fromDate = new Date(todayDate)
  
  switch (range) {
    case 'week':
      fromDate.setDate(todayDate.getDate() - 6)
      break
    case 'month':
      fromDate.setDate(todayDate.getDate() - 29)
      break
    case 'quarter':
      fromDate.setDate(todayDate.getDate() - 89)
      break
    case 'year':
      fromDate.setDate(todayDate.getDate() - 364)
      break
  }
  
  dateFrom.value = fromDate.toISOString().split('T')[0]
  dateTo.value = todayDate.toISOString().split('T')[0]
  
  console.log('Period:', dateFrom.value, '→', dateTo.value)
  const daysDiff = Math.ceil((todayDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
  console.log('Total days:', daysDiff)
  
  loadDailyRevenue()
}

const onDateChange = () => {
  quickRange.value = ''
}

const loadOverview = async () => {
  try {
    const data = await getAdminOverview()
    overview.value = data
  } catch (error) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Ошибка загрузки статистики'
    })
    console.error('❌ Error loading overview:', error.response?.data || error.message)
  }
}

const loadDailyRevenue = async () => {
  if (!dateFrom.value || !dateTo.value) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Выберите период'
    })
    return
  }
  
  // Проверяем, что начальная дата не позже конечной
  const fromDate = new Date(dateFrom.value)
  const toDate = new Date(dateTo.value)
  
  if (fromDate > toDate) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Начальная дата не может быть позже конечной'
    })
    return
  }
  
  // Проверяем, что даты не в будущем
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  
  if (fromDate > todayDate || toDate > todayDate) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Нельзя выбрать даты из будущего'
    })
    return
  }
  
  console.log('\n=== 📤 REQUEST TO BACKEND ===')
  console.log('Endpoint: /admin/stats/daily-revenue')
  console.log('Params:', { from: dateFrom.value, to: dateTo.value })
  
  loading.value = true
  try {
    const data = await getDailyRevenue(dateFrom.value, dateTo.value)
    
    console.log('\n=== 📥 RESPONSE FROM BACKEND ===')
    console.log('Total days received:', data.length)
    if (data.length > 0) {
      console.log('First date:', data[0].date, '| Revenue:', data[0].revenue, '₽')
      console.log('Last date:', data[data.length - 1].date, '| Revenue:', data[data.length - 1].revenue, '₽')
      
      // Show all dates with revenue
      const datesWithRevenue = data.filter(d => d.revenue > 0)
      console.log('\nDates with revenue (' + datesWithRevenue.length + '):')
      datesWithRevenue.forEach(d => {
        console.log(`  ${d.date}: ${d.revenue} ₽`)
      })
    } else {
      console.log('⚠️ No data received')
      showNotification({
        type: 'info',
        title: 'Информация',
        message: 'Нет данных за выбранный период'
      })
    }
    
    dailyData.value = data
    await nextTick()
    renderChart()
    loadTopCars()
  } catch (error) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Ошибка загрузки данных'
    })
    console.error('❌ [API Error] Error loading daily revenue:', error)
    console.error('❌ [Error Details]', error.response?.data || error.message)
  } finally {
    loading.value = false
  }
}

const loadTopCars = async () => {
  if (!dateFrom.value || !dateTo.value) return
  
  topCarsLoading.value = true
  try {
    console.log('\n=== 📤 REQUEST TO BACKEND ===')
    console.log('Endpoint: /admin/stats/cars/top')
    console.log('Params:', { from: dateFrom.value, to: dateTo.value, page: 0, size: 10 })
    
    const response = await getTopCarsByProfit(dateFrom.value, dateTo.value, { page: 0, size: 10 })
    topCars.value = response.content || []
    
    console.log('\n=== 📥 RESPONSE FROM BACKEND ===')
    console.log('Top cars loaded:', topCars.value.length)
    if (topCars.value.length > 0) {
      console.log('Top 3:')
      topCars.value.slice(0, 3).forEach((car, i) => {
        console.log(`  ${i + 1}. ${car.brand} ${car.model} - ${car.totalProfit} ₽`)
      })
    }
  } catch (error) {
    console.error('❌ Error loading top cars:', error)
    topCars.value = []
  } finally {
    topCarsLoading.value = false
  }
}

const selectDay = async (day) => {
  if (!day || !day.date) {
    console.error('❌ [Error] Invalid day selected:', day)
    return
  }
  
  console.log('🔍 [Day Selected] Full day object:', day)
  console.log('🔍 [Day Selected] Date:', day.date, 'Revenue:', day.revenue, 'Day Number:', day.dayNumber)
  
  selectedDate.value = day.date
  showDayDetails.value = true
  loadingDayDetails.value = true
  dayContracts.value = []
  
  try {
    console.log('🔄 [API Request] Loading contracts for day:', day.date)
    console.log('🔄 [API Request] Expected revenue from calendar:', day.revenue)
    
    const contracts = await getContractsByDay(day.date)
    
    console.log('✅ [API Response] Received contracts:', contracts)
    console.log('📊 [Contracts Count]', contracts.length)
    
    if (contracts && contracts.length > 0) {
      const totalCost = contracts.reduce((sum, c) => sum + (Number(c.totalCost) || 0), 0)
      const totalMinutes = contracts.reduce((sum, c) => sum + (Number(c.durationMinutes) || 0), 0)
      
      console.log('📊 [Day Summary]:')
      console.log('  - Contracts:', contracts.length)
      console.log('  - Total Cost (calculated from contracts):', totalCost)
      console.log('  - Total Minutes:', totalMinutes)
      console.log('  - Revenue from calendar (what user saw):', day.revenue)
      console.log('  - Date clicked:', day.date)
      console.log('  - Date in modal should be:', day.date)
      
      const difference = Math.abs(totalCost - day.revenue)
      if (difference > 0.01) { // Allow small floating point differences
        console.error('❌ [CRITICAL DATA MISMATCH]')
        console.error('   Calendar shows:', day.revenue, '₽')
        console.error('   Contracts total:', totalCost, '₽')
        console.error('   Difference:', difference, '₽')
        console.error('   This is a DATA INTEGRITY ISSUE!')
        showNotification({
          type: 'warning',
          title: '⚠️ ВНИМАНИЕ: Расхождение данных!',
          message: `В календаре: ${formatCurrency(day.revenue)}, в контрактах: ${formatCurrency(totalCost)}`
        })
      } else {
        console.log('✅ [Data Match] Revenue matches perfectly!')
      }
      
      dayContracts.value = contracts
    } else {
      console.warn('⚠️ [No Contracts] No contracts found for date:', day.date)
      if (day.revenue > 0) {
        console.error('❌ [CRITICAL ERROR] Revenue exists in calendar but no contracts found!')
        console.error('   Date:', day.date)
        console.error('   Revenue shown:', day.revenue)
        console.error('   This indicates backend data inconsistency!')
        showNotification({
          type: 'error',
          title: '❌ ОШИБКА: Нет контрактов',
          message: `Выручка ${formatCurrency(day.revenue)} отображается, но контракты не найдены!`
        })
      }
      dayContracts.value = []
    }
  } catch (error) {
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Ошибка загрузки контрактов'
    })
    console.error('❌ [API Error] Error loading contracts:', error)
    console.error('❌ [Error Details]', error.response?.data || error.message)
    dayContracts.value = []
  } finally {
    loadingDayDetails.value = false
  }
}

const closeDayDetails = () => {
  showDayDetails.value = false
  selectedDate.value = null
  dayContracts.value = []
}

const getRevenueForDate = (dateStr) => {
  if (!dateStr || !dailyData.value) return 0
  const day = dailyData.value.find(d => d.date === dateStr)
  return day ? day.revenue : 0
}

const renderChart = async () => {
  if (!chartCanvas.value || !dailyData.value || dailyData.value.length === 0) return
  
  try {
    await nextTick()
    
    const Chart = (await import('chart.js/auto')).default
    
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    
    const ctx = chartCanvas.value.getContext('2d')
    
    // Prepare data
    const labels = dailyData.value.map(d => formatDate(d.date))
    const revenues = dailyData.value.map(d => Number(d.revenue) || 0)
    
    const maxRevenue = Math.max(...revenues)
    const minRevenue = Math.min(...revenues.filter(r => r > 0))
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Выручка',
          data: revenues,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: revenues.length > 90 ? 0 : 3, // Hide points for large datasets
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `Выручка: ${formatCurrency(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 15
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ Chart rendering error:', error)
    showNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Ошибка отображения графика'
    })
  }
}

// Lifecycle
onMounted(() => {
  loadOverview()
  setDateRange('month')
})
</script>
