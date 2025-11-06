<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 appearance-none cursor-pointer"
      >
        <option value="" disabled>Выберите {{ label?.toLowerCase() || 'опцию' }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
