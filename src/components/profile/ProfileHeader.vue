<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit'])
</script>

<template>
  <div class="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-8 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {{ user?.firstName?.[0]?.toUpperCase() || 'U' }}{{ user?.lastName?.[0]?.toUpperCase() || '' }}
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ user?.firstName || '' }} {{ user?.lastName || '' }}
          </h2>
          <p class="text-gray-600 mt-1">@{{ user?.login || '' }}</p>
        </div>
      </div>
      <button
        v-if="!editMode"
        @click="$emit('edit')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Редактировать
      </button>
    </div>
  </div>
</template>
