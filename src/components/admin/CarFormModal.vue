<template>
  <Transition name="modal-fade">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6 flex items-center justify-between rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white">
                {{ car ? 'Редактировать автомобиль' : 'Добавить автомобиль' }}
              </h3>
              <p class="text-primary-100 text-sm mt-1">Заполните данные автомобиля</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabs (только при создании) -->
        <div v-if="!car" class="border-b border-gray-200 bg-gray-50">
          <div class="flex px-8">
            <button
              type="button"
              @click="activeTab = 'existing'"
              :class="[
                'px-6 py-4 text-sm font-semibold transition-all relative',
                activeTab === 'existing'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Выбрать модель
              </div>
            </button>
            <button
              type="button"
              @click="activeTab = 'new'"
              :class="[
                'px-6 py-4 text-sm font-semibold transition-all relative',
                activeTab === 'new'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Создать новую модель
              </div>
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Left Column: Model Selection -->
            <div class="space-y-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Модель автомобиля
                </h4>

                <!-- Existing Model Selection -->
                <div v-if="car || activeTab === 'existing'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Выберите модель <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model.number="form.modelId"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    >
                      <option value="">— Выберите из списка —</option>
                      <option v-for="model in models" :key="model.modelId" :value="model.modelId">
                        {{ model.brand }} {{ model.model }} · {{ model.bodyType }} · {{ model.carClass }}
                      </option>
                    </select>
                  </div>

                  <!-- Selected Model Preview -->
                  <div v-if="selectedModel" class="bg-white rounded-xl p-4 border-2 border-primary-200">
                    <div class="text-xs font-semibold text-primary-600 mb-2">ВЫБРАННАЯ МОДЕЛЬ</div>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div class="text-gray-500">Марка</div>
                        <div class="font-semibold">{{ selectedModel.brand }}</div>
                      </div>
                      <div>
                        <div class="text-gray-500">Модель</div>
                        <div class="font-semibold">{{ selectedModel.model }}</div>
                      </div>
                      <div>
                        <div class="text-gray-500">Кузов</div>
                        <div class="font-semibold">{{ selectedModel.bodyType }}</div>
                      </div>
                      <div>
                        <div class="text-gray-500">Класс</div>
                        <div class="font-semibold">{{ selectedModel.carClass }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- New Model Creation -->
                <div v-else-if="activeTab === 'new'" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Brand with Create Option -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>Марка <span class="text-red-500">*</span></span>
                        <button
                          v-if="isNewBrand"
                          type="button"
                          @click="createNewBrand"
                          :disabled="!newModel.brand || creatingBrand"
                          class="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {{ creatingBrand ? 'Создание...' : 'Создать' }}
                        </button>
                      </label>
                      <input
                        v-model="newModel.brand"
                        type="text"
                        list="brands-list"
                        required
                        placeholder="Выберите или введите новую"
                        :class="[
                          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                          isNewBrand ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        ]"
                      />
                      <datalist id="brands-list">
                        <option v-for="brand in allBrands" :key="brand" :value="brand" />
                      </datalist>
                      <div v-if="isNewBrand" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Новая марка - нажмите "Создать"
                      </div>
                    </div>

                    <!-- Model Name with Create Option -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>Модель <span class="text-red-500">*</span></span>
                        <button
                          v-if="isNewModelName"
                          type="button"
                          @click="createNewModelName"
                          :disabled="!newModel.model || creatingModelName"
                          class="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {{ creatingModelName ? 'Создание...' : 'Создать' }}
                        </button>
                      </label>
                      <input
                        v-model="newModel.model"
                        type="text"
                        list="models-list"
                        required
                        placeholder="Выберите или введите новую"
                        :class="[
                          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                          isNewModelName ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        ]"
                      />
                      <datalist id="models-list">
                        <option v-for="modelName in allModelNames" :key="modelName" :value="modelName" />
                      </datalist>
                      <div v-if="isNewModelName" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Новая модель - нажмите "Создать"
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <!-- Body Type with Create Option -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Тип кузова <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="newModel.bodyType"
                        type="text"
                        list="body-types-list"
                        required
                        placeholder="Выберите тип кузова"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                      <datalist id="body-types-list">
                        <option v-for="type in allBodyTypes" :key="type" :value="type" />
                      </datalist>
                    </div>

                    <!-- Car Class with Create Option -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>Класс <span class="text-red-500">*</span></span>
                        <button
                          v-if="isNewClass"
                          type="button"
                          @click="createNewClass"
                          :disabled="!newModel.carClass || creatingClass"
                          class="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {{ creatingClass ? 'Создание...' : 'Создать' }}
                        </button>
                      </label>
                      <input
                        v-model="newModel.carClass"
                        type="text"
                        list="classes-list"
                        required
                        placeholder="Выберите или введите новый"
                        :class="[
                          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                          isNewClass ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        ]"
                      />
                      <datalist id="classes-list">
                        <option v-for="cls in allClasses" :key="cls" :value="cls" />
                      </datalist>
                      <div v-if="isNewClass" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Новый класс - нажмите "Создать"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Car Details -->
            <div class="space-y-6">
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Данные автомобиля
                </h4>

                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Год выпуска <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model.number="form.yearOfIssue"
                        type="number"
                        min="1900"
                        :max="new Date().getFullYear() + 1"
                        required
                        placeholder="2020"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Стоимость (₽/день) <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model.number="form.rent"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="5000"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Гос. номер <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.gosNumber"
                      type="text"
                      required
                      placeholder="А123БВ777"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all uppercase"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      VIN <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.vin"
                      type="text"
                      required
                      maxlength="17"
                      placeholder="1HGBH41JXMN109186"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all uppercase font-mono"
                    />
                    <div class="text-xs text-gray-500 mt-1">17 символов</div>
                  </div>

                  <!-- State (только при создании) -->
                  <div v-if="!car">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Состояние <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model.number="form.stateId"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="">Выберите состояние</option>
                      <option v-for="state in carStates" :key="state.id" :value="state.id">
                        {{ state.status }}
                      </option>
                    </select>
                  </div>

                  <!-- Image Upload (только при создании) -->
                  <div v-if="!car">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Изображение <span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center gap-4">
                      <div v-if="imagePreview" class="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-200">
                        <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                        <button
                          @click="imageFile = null; imagePreview = null"
                          type="button"
                          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div class="flex-1">
                        <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all">
                          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-sm font-medium text-gray-700">{{ imageFile ? 'Изменить фото' : 'Выбрать фото' }}</span>
                          <input
                            type="file"
                            accept="image/*"
                            @change="handleImageChange"
                            class="hidden"
                          />
                        </label>
                        <p class="text-xs text-gray-500 mt-1">JPG, PNG или GIF (макс. 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="font-semibold">Ошибка</div>
              <div class="text-sm">{{ error }}</div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!saving">
                <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ car ? 'Сохранить изменения' : 'Создать автомобиль' }}
              </span>
              <span v-else>Сохранение...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getErrorMessage } from '../../utils/errorHandler'
import api from '../../services/api'
import { getAdminBrands, getAdminModelNames, getAdminClasses, createModel } from '../../services/adminService'

const props = defineProps({
  car: {
    type: Object,
    default: null
  },
  allBodyTypes: {
    type: Array,
    default: () => []
  },
  allClasses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

const activeTab = ref('existing')
const form = ref({
  modelId: '',
  yearOfIssue: new Date().getFullYear(),
  gosNumber: '',
  vin: '',
  rent: 0,
  stateId: ''
})

const newModel = ref({
  brand: '',
  model: '',
  bodyType: '',
  carClass: ''
})

const models = ref([])
const carStates = ref([])
const allBrands = ref([])
const allModelNames = ref([])
const allClasses = ref([])
const allBodyTypes = ref([])
const saving = ref(false)
const error = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)

// Flags for creating new reference values
const creatingBrand = ref(false)
const creatingModelName = ref(false)
const creatingClass = ref(false)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const selectedModel = computed(() => {
  return models.value.find(m => m.modelId === form.value.modelId)
})

// Check if entered value is new
const isNewBrand = computed(() => {
  return newModel.value.brand && !allBrands.value.includes(newModel.value.brand)
})

const isNewModelName = computed(() => {
  return newModel.value.model && !allModelNames.value.includes(newModel.value.model)
})

const isNewClass = computed(() => {
  return newModel.value.carClass && !allClasses.value.includes(newModel.value.carClass)
})

const loadModels = async () => {
  try {
    const response = await api.get('/admin/models', { params: { size: 1000 } })
    models.value = response.data.content
  } catch (err) {
    console.error('Error loading models:', err)
  }
}

const loadCarStates = async () => {
  try {
    const response = await api.get('/admin/cars/state')
    carStates.value = response.data
  } catch (err) {
    console.error('Error loading car states:', err)
  }
}

const loadFilterOptions = async () => {
  try {
    const [brands, modelNames, classes] = await Promise.all([
      getAdminBrands(),
      getAdminModelNames(),
      getAdminClasses()
    ])
    allBrands.value = brands
    allModelNames.value = modelNames
    allClasses.value = classes
    allBodyTypes.value = props.allBodyTypes
  } catch (err) {
    console.error('Error loading filter options:', err)
  }
}

// Functions to create new reference values
const createNewBrand = async () => {
  if (!newModel.value.brand || creatingBrand.value) return
  creatingBrand.value = true
  try {
    await api.post('/admin/filters/brands', { name: newModel.value.brand })
    allBrands.value.push(newModel.value.brand)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания марки')
  } finally {
    creatingBrand.value = false
  }
}

const createNewModelName = async () => {
  if (!newModel.value.model || creatingModelName.value) return
  creatingModelName.value = true
  try {
    await api.post('/admin/filters/models', { name: newModel.value.model })
    allModelNames.value.push(newModel.value.model)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания модели')
  } finally {
    creatingModelName.value = false
  }
}

const createNewClass = async () => {
  if (!newModel.value.carClass || creatingClass.value) return
  creatingClass.value = true
  try {
    await api.post('/admin/filters/classes', { name: newModel.value.carClass })
    allClasses.value.push(newModel.value.carClass)
  } catch (err) {
    error.value = getErrorMessage(err, 'Ошибка создания класса')
  } finally {
    creatingClass.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    let modelId = form.value.modelId

    // If creating new model, create all new reference values first, then create model
    if (!props.car && activeTab.value === 'new') {
      // Create new brand if needed
      if (isNewBrand.value) {
        await createNewBrand()
      }
      
      // Create new model name if needed
      if (isNewModelName.value) {
        await createNewModelName()
      }
      
      // Create new class if needed
      if (isNewClass.value) {
        await createNewClass()
      }
      
      // Now create the model
      const createdModel = await createModel(newModel.value)
      modelId = createdModel.modelId
    }

    if (props.car) {
      // Update existing car - все поля как в UpdateCarRequest
      console.log('=== 📤 PATCH REQUEST TO /admin/cars/' + props.car.carId + ' ===')
      const updateData = {
        modelId: modelId,
        yearOfIssue: form.value.yearOfIssue,
        gosNumber: form.value.gosNumber,
        vin: form.value.vin,
        rent: form.value.rent
      }
      console.log('Update data:', JSON.stringify(updateData, null, 2))
      await api.patch(`/admin/cars/${props.car.carId}`, updateData)
    } else {
      // Валидация изображения для нового авто
      if (!imageFile.value) {
        error.value = 'Выберите изображение автомобиля'
        saving.value = false
        return
      }

      // Create new car - используем FormData
      console.log('=== 📤 POST REQUEST TO /admin/cars ===')
      const carData = {
        modelId: modelId,
        yearOfIssue: form.value.yearOfIssue,
        gosNumber: form.value.gosNumber,
        vin: form.value.vin,
        rent: form.value.rent,
        stateId: form.value.stateId
      }
      console.log('Car data:', JSON.stringify(carData, null, 2))
      console.log('Image file:', imageFile.value.name, imageFile.value.type, imageFile.value.size + ' bytes')
      
      const formData = new FormData()
      formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }))
      formData.append('image', imageFile.value)
      
      console.log('FormData entries:')
      for (let pair of formData.entries()) {
        console.log('  -', pair[0] + ':', pair[1])
      }
      
      await api.post('/admin/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('=== ✅ SUCCESS ===')
    }
    emit('saved')
  } catch (err) {
    console.error('=== ❌ ERROR ===' , err)
    error.value = getErrorMessage(err, 'Ошибка сохранения автомобиля')
  } finally {
    saving.value = false
  }
}

watch(() => props.car, (newCar) => {
  if (newCar) {
    form.value = {
      modelId: newCar.modelId || '',
      yearOfIssue: newCar.yearOfIssue || new Date().getFullYear(),
      gosNumber: newCar.gosNumber || '',
      vin: newCar.vin || '',
      rent: newCar.rent || 0,
      stateId: '' // stateId не используется при редактировании
    }
  }
}, { immediate: true })

onMounted(() => {
  loadModels()
  loadCarStates()
  loadFilterOptions()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.95);
}
</style>
