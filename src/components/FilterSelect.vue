<template>
  <div class="relative w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Input Wrapper -->
    <div class="relative" ref="wrapperRef">
      <input
        v-model="query"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900"
        :placeholder="placeholder"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.enter.stop.prevent="handleEnter"
      />

      <!-- Dropdown -->
      <div
        v-if="isFocused && hasOptions"
        class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        @mousedown.prevent
      >
        <div
          v-for="item in filteredItems"
          :key="item"
          class="px-4 py-2.5 text-sm text-gray-900 hover:bg-primary-50 hover:text-primary-700 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
          @click="select(item)"
        >
          {{ item }}
        </div>
        <div v-if="filteredItems.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
          Ничего не найдено
        </div>
      </div>
    </div>

    <!-- Selected Chips -->
    <div v-if="selected.length" class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="item in selected"
        :key="item"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors duration-150"
      >
        {{ item }}
        <button
          type="button"
          class="ml-0.5 hover:text-primary-900 focus:outline-none transition-colors"
          @click="remove(item)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Выберите...' }
})

const emit = defineEmits(['update:modelValue'])

const query = defineModel('query', { default: '' })
const isFocused = ref(false)
const wrapperRef = ref(null)

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const filteredItems = computed(() => {
  const q = query.value?.toLowerCase().trim()
  return props.options
    .filter(item => !selected.value.includes(item))
    .filter(item => !q || item.toLowerCase().includes(q))
})

const hasOptions = computed(() => props.options.length > 0)

const select = (item) => {
  if (!selected.value.includes(item)) {
    selected.value = [...selected.value, item]
  }
  query.value = ''
  isFocused.value = false
}

const remove = (item) => {
  selected.value = selected.value.filter(v => v !== item)
}

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 150)
}

const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleEnter = () => {
  if (filteredItems.value.length === 1) {
    select(filteredItems.value[0])
  }
}
</script>
