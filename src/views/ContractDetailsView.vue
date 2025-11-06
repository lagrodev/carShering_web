<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Загрузка договора...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <svg class="w-20 h-20 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <Button variant="primary" @click="$router.push('/contracts')">
          Вернуться к списку
        </Button>
      </div>
    </div>

    <!-- Contract Details -->
    <main v-else class="flex-1">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <button
                @click="$router.push('/contracts')"
                class="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Назад к списку
              </button>
              <h1 class="text-3xl md:text-4xl font-bold">Договор №{{ contract.id }}</h1>
              <p class="text-primary-100 mt-2">{{ contract.brand }} {{ contract.model }} • {{ contract.yearOfIssue }}</p>
            </div>
            <span
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold',
                getStatusBgClass(contract.state)
              ]"
            >
              {{ getStatusText(contract.state) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-800 font-medium">{{ successMessage }}</p>
        </div>

        <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-800 font-medium">{{ errorMessage }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Car Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Car Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Информация об автомобиле</h2>
                <div class="flex gap-6">
                  <div class="w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src="../assets/images/blue-car.png"
                      :alt="`${contract.brand} ${contract.model}`"
                      class="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div class="flex-1 space-y-3">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900">{{ contract.brand }} {{ contract.model }}</h3>
                      <p class="text-gray-600 mt-1">{{ contract.yearOfIssue }} • {{ formatCarClass(contract.carClass) }} • {{ contract.bodyType }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p class="text-sm text-gray-600">VIN</p>
                        <p class="font-semibold text-gray-900">{{ contract.vin }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Гос. номер</p>
                        <p class="font-semibold text-gray-900">{{ contract.gosNumber }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rental Period Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-xl font-bold text-gray-900">Период аренды</h2>
                  <button
                    v-if="canEdit && !editMode"
                    @click="enableEditMode"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Изменить даты
                  </button>
                </div>

                <!-- View Mode -->
                <div v-if="!editMode" class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Дата начала
                    </label>
                    <p class="text-lg font-semibold text-gray-900 pl-7">{{ formatDate(contract.startDate) }}</p>
                  </div>
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Дата окончания
                    </label>
                    <p class="text-lg font-semibold text-gray-900 pl-7">{{ formatDate(contract.endDate) }}</p>
                  </div>
                </div>

                <!-- Edit Mode -->
                <form v-else @submit.prevent="saveChanges" class="space-y-4">
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label for="startDate" class="block text-sm font-medium text-gray-700">
                        Дата начала <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="startDate"
                        v-model="editForm.dataStart"
                        type="date"
                        required
                        :min="today"
                        :max="maxDate"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div class="space-y-2">
                      <label for="endDate" class="block text-sm font-medium text-gray-700">
                        Дата окончания <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="endDate"
                        v-model="editForm.dataEnd"
                        type="date"
                        required
                        :min="minEndDate"
                        :max="maxEndDate"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="flex gap-3 pt-2">
                    <Button type="submit" variant="primary" :disabled="saving">
                      {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                    </Button>
                    <Button type="button" variant="outline" @click="cancelEdit">Отмена</Button>
                  </div>
                </form>

                <!-- Duration Info -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600">Длительность аренды:</span>
                    <span class="text-lg font-semibold text-gray-900">{{ rentalDuration }} {{ getDaysText(rentalDuration) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Client Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Арендатор</h2>
                <div class="space-y-2">
                  <p class="text-gray-600">Фамилия: <span class="font-semibold text-gray-900">{{ contract.lastName }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Summary & Actions -->
          <div class="space-y-6">
            <!-- Cost Summary -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
              <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
                <h2 class="text-lg font-bold text-white">Сводка по договору</h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between text-gray-600">
                  <span>Длительность:</span>
                  <span class="font-semibold text-gray-900">{{ rentalDuration }} дн.</span>
                </div>
                <div class="pt-4 border-t border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-900">Итого:</span>
                    <span class="text-2xl font-bold text-primary-600">{{ contract.totalCost?.toFixed(2) }} ₽</span>
                  </div>
                </div>

                <!-- Status Info -->
                <div class="pt-4 border-t border-gray-200">
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-700">Статус договора:</p>
                    <span
                      :class="[
                        'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold w-full justify-center',
                        getStatusBgClass(contract.state)
                      ]"
                    >
                      <svg v-if="contract.state === 'ACTIVE'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else-if="contract.state === 'PENDING'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      {{ getStatusText(contract.state) }}
                    </span>
                    <p v-if="contract.state === 'PENDING'" class="text-xs text-gray-600 text-center">
                      Ожидает подтверждения администратором
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div v-if="canCancel" class="pt-4 border-t border-gray-200">
                  <button
                    @click="handleCancel"
                    :disabled="saving"
                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Отменить договор
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import { getContractById, updateContract, cancelContract } from '../services/contractService.js'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Button from '../components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const { showConfirm } = useNotification()

const contract = ref(null)
const loading = ref(true)
const error = ref(null)
const editMode = ref(false)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const editForm = ref({
  dataStart: '',
  dataEnd: ''
})

const today = computed(() => new Date().toISOString().split('T')[0])
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().split('T')[0]
})

const minEndDate = computed(() => editForm.value.dataStart || today.value)
const maxEndDate = computed(() => {
  if (!editForm.value.dataStart) return maxDate.value
  const start = new Date(editForm.value.dataStart)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  const maxDateObj = new Date(maxDate.value)
  return (end > maxDateObj ? maxDateObj : end).toISOString().split('T')[0]
})

const canEdit = computed(() => {
  if (!contract.value) return false
  const state = contract.value.state?.toUpperCase()
  return state === 'PENDING' || state === 'CREATED'
})

const canCancel = computed(() => {
  if (!contract.value) return false
  const state = contract.value.state?.toUpperCase()
  return state === 'PENDING' || state === 'CREATED' || state === 'ACTIVE'
})

const rentalDuration = computed(() => {
  if (!contract.value) return 0
  const start = new Date(contract.value.startDate)
  const end = new Date(contract.value.endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
})

watch([editForm.value], () => {
  if (editForm.value.dataStart && editForm.value.dataEnd) {
    const start = new Date(editForm.value.dataStart)
    const end = new Date(editForm.value.dataEnd)
    if (end < start) {
      editForm.value.dataEnd = editForm.value.dataStart
    }
  }
})

const showMessage = (message, isError = false) => {
  if (isError) {
    errorMessage.value = message
    successMessage.value = ''
  } else {
    successMessage.value = message
    errorMessage.value = ''
  }
  
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

const loadContract = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getContractById(route.params.id)
    contract.value = data
  } catch (err) {
    if (err.response?.status === 401) {
      await router.push('/auth')
    } else if (err.response?.status === 404) {
      error.value = 'Договор не найден'
    } else {
      error.value = 'Не удалось загрузить договор'
    }
  } finally {
    loading.value = false
  }
}

const enableEditMode = () => {
  editForm.value = {
    dataStart: formatDateForInput(contract.value.startDate),
    dataEnd: formatDateForInput(contract.value.endDate)
  }
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  editForm.value = { dataStart: '', dataEnd: '' }
}

const saveChanges = async () => {
  saving.value = true
  try {
    const updated = await updateContract(contract.value.id, editForm.value)
    contract.value = updated
    editMode.value = false
    showMessage('Даты аренды успешно обновлены')
  } catch (err) {
    showMessage(err.response?.data?.message || 'Не удалось обновить договор', true)
  } finally {
    saving.value = false
  }
}

const handleCancel = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Отмена договора',
    message: 'Вы уверены, что хотите отменить этот договор? Это действие нельзя отменить.'
  })
  if (!confirmed) return

  saving.value = true
  try {
    await cancelContract(contract.value.id)
    showMessage('Договор успешно отменен')
    setTimeout(() => {
      router.push('/contracts')
    }, 1500)
  } catch (err) {
    showMessage(err.response?.data?.message || 'Не удалось отменить договор', true)
  } finally {
    saving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = Array.isArray(dateString)
    ? new Date(dateString[0], dateString[1] - 1, dateString[2])
    : new Date(dateString)
  
  if (isNaN(date.getTime())) return 'N/A'
  
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = Array.isArray(dateString)
    ? new Date(dateString[0], dateString[1] - 1, dateString[2])
    : new Date(dateString)
  
  if (isNaN(date.getTime())) return ''
  
  return date.toISOString().split('T')[0]
}

const formatCarClass = (carClass) => {
  if (!carClass) return ''
  const classMap = {
    'COMPACT': 'Компакт',
    'MID_SIZE': 'Средний',
    'FULL_SIZE': 'Полноразмерный',
    'LUXURY': 'Премиум',
    'SUV': 'Внедорожник',
    'TRUCK': 'Пикап',
    'VAN': 'Фургон',
    'SPORT': 'Спорт'
  }
  return classMap[carClass] || carClass
}

const getStatusText = (state) => {
  if (!state) return 'Неизвестно'
  const upperState = state.toUpperCase()
  const stateMap = {
    'ACTIVE': 'Активный',
    'PENDING': 'Ожидает подтверждения',
    'CREATED': 'Создан',
    'COMPLETED': 'Завершен',
    'CANCELLED': 'Отменен',
    'FINISHED': 'Завершен'
  }
  return stateMap[upperState] || state
}

const getStatusBgClass = (state) => {
  if (!state) return 'bg-gray-100 text-gray-700'
  const upperState = state.toUpperCase()
  const classMap = {
    'ACTIVE': 'bg-green-100 text-green-700 border border-green-200',
    'PENDING': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'CREATED': 'bg-blue-100 text-blue-700 border border-blue-200',
    'COMPLETED': 'bg-gray-100 text-gray-700 border border-gray-200',
    'CANCELLED': 'bg-red-100 text-red-700 border border-red-200',
    'FINISHED': 'bg-gray-100 text-gray-700 border border-gray-200'
  }
  return classMap[upperState] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const getDaysText = (days) => {
  if (days === 1) return 'день'
  if (days >= 2 && days <= 4) return 'дня'
  return 'дней'
}

onMounted(() => {
  loadContract()
})
</script>
