<script setup>
import Button from '../ui/Button.vue'

defineProps({
  passwordMode: {
    type: Boolean,
    default: false
  },
  passwordForm: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'save', 'cancel', 'update:passwordForm'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Смена пароля</h3>
      </div>
      <button
        v-if="!passwordMode"
        @click="$emit('toggle')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Изменить пароль
      </button>
    </div>

    <div class="p-6">
      <div v-if="!passwordMode" class="text-center py-6 text-gray-600">
        Нажмите "Изменить пароль" чтобы обновить пароль
      </div>

      <form v-else @submit.prevent="$emit('save')" class="space-y-4">
        <div class="space-y-2">
          <label for="oldPassword" class="block text-sm font-medium text-gray-700">
            Текущий пароль <span class="text-red-500">*</span>
          </label>
          <input
            id="oldPassword"
            :value="passwordForm.oldPassword"
            @input="$emit('update:passwordForm', { ...passwordForm, oldPassword: $event.target.value })"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div class="space-y-2">
          <label for="newPassword" class="block text-sm font-medium text-gray-700">
            Новый пароль <span class="text-red-500">*</span>
          </label>
          <input
            id="newPassword"
            :value="passwordForm.newPassword"
            @input="$emit('update:passwordForm', { ...passwordForm, newPassword: $event.target.value })"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
          <p class="text-xs text-gray-500">Минимум 6 символов</p>
        </div>

        <div class="flex gap-3 pt-2">
          <Button type="submit" variant="primary" :disabled="saving">
            {{ saving ? 'Сохранение...' : 'Изменить пароль' }}
          </Button>
          <Button type="button" variant="outline" @click="$emit('cancel')">Отмена</Button>
        </div>
      </form>
    </div>
  </div>
</template>
