<script setup>
import Button from '../ui/Button.vue'

defineProps({
  user: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  },
  editForm: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['save', 'cancel'])
</script>

<template>
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
    
    <!-- View Mode -->
    <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Имя
        </label>
        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
          {{ user?.firstName || '—' }}
        </div>
      </div>

      <div class="space-y-2">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Фамилия
        </label>
        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
          {{ user?.lastName || '—' }}
        </div>
      </div>

      <div class="space-y-2">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </label>
        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
          {{ user?.email || '—' }}
        </div>
      </div>

      <div class="space-y-2">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Телефон
        </label>
        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
          {{ user?.phone || '—' }}
        </div>
      </div>

      <div class="space-y-2">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
          Логин
        </label>
        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
          {{ user?.login || '—' }}
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <form v-else @submit.prevent="$emit('save')" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-medium text-gray-700">Имя</label>
          <input
            id="firstName"
            :value="editForm.firstName"
            @input="$emit('update:editForm', { ...editForm, firstName: $event.target.value })"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Фамилия</label>
          <input
            id="lastName"
            :value="editForm.lastName"
            @input="$emit('update:editForm', { ...editForm, lastName: $event.target.value })"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label for="phone" class="block text-sm font-medium text-gray-700">Телефон</label>
          <input
            id="phone"
            :value="editForm.phone"
            @input="$emit('update:editForm', { ...editForm, phone: $event.target.value })"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <Button type="submit" variant="primary" :disabled="saving">
          {{ saving ? 'Сохранение...' : 'Сохранить' }}
        </Button>
        <Button type="button" variant="outline" @click="$emit('cancel')">Отмена</Button>
      </div>
    </form>
  </div>
</template>
