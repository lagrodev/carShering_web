<script setup>
import { computed } from 'vue'
import Button from '../ui/Button.vue'

const props = defineProps({
  document: {
    type: Object,
    default: null
  },
  editMode: {
    type: Boolean,
    default: false
  },
  documentForm: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  today: {
    type: String,
    required: true
  }
})

defineEmits(['add', 'edit', 'save', 'cancel', 'delete', 'update:documentForm'])

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Водительское удостоверение</h3>
      </div>
      <button
        v-if="!document && !editMode"
        @click="$emit('add')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Добавить
      </button>
      <button
        v-else-if="document && !editMode"
        @click="$emit('edit')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Редактировать
      </button>
    </div>

    <div class="p-6">
      <!-- No Document -->
      <div v-if="!document && !editMode" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600">Водительское удостоверение не добавлено</p>
        <p class="text-sm text-gray-500 mt-1">Добавьте документ для аренды автомобилей</p>
      </div>

      <!-- View Document -->
      <div v-else-if="document && !editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Серия</label>
          <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
            {{ document.series }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Номер</label>
          <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
            {{ document.number }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Дата выдачи</label>
          <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
            {{ formatDate(document.dateOfIssue) }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Орган выдачи</label>
          <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
            {{ document.issuingAuthority }}
          </div>
        </div>
      </div>

      <!-- Edit Document -->
      <form v-else @submit.prevent="$emit('save')" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="series" class="block text-sm font-medium text-gray-700">
              Серия <span class="text-red-500">*</span>
            </label>
            <input
              id="series"
              :value="documentForm.series"
              @input="$emit('update:documentForm', { ...documentForm, series: $event.target.value })"
              type="text"
              required
              placeholder="12 34"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="space-y-2">
            <label for="number" class="block text-sm font-medium text-gray-700">
              Номер <span class="text-red-500">*</span>
            </label>
            <input
              id="number"
              :value="documentForm.number"
              @input="$emit('update:documentForm', { ...documentForm, number: $event.target.value })"
              type="text"
              required
              placeholder="567890"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="space-y-2">
            <label for="dateOfIssue" class="block text-sm font-medium text-gray-700">
              Дата выдачи <span class="text-red-500">*</span>
            </label>
            <input
              id="dateOfIssue"
              :value="documentForm.dateOfIssue"
              @input="$emit('update:documentForm', { ...documentForm, dateOfIssue: $event.target.value })"
              type="date"
              required
              :max="today"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="space-y-2">
            <label for="issuingAuthority" class="block text-sm font-medium text-gray-700">
              Орган выдачи <span class="text-red-500">*</span>
            </label>
            <input
              id="issuingAuthority"
              :value="documentForm.issuingAuthority"
              @input="$emit('update:documentForm', { ...documentForm, issuingAuthority: $event.target.value })"
              type="text"
              required
              placeholder="ГИБДД 1234"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <Button type="submit" variant="primary" :disabled="saving">
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </Button>
          <Button type="button" variant="outline" @click="$emit('cancel')">Отмена</Button>
          <Button
            v-if="document"
            type="button"
            variant="danger"
            @click="$emit('delete')"
            class="ml-auto"
          >
            Удалить
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
