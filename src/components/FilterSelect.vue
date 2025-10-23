<!-- src/components/FilterSelect.vue -->
<template>
  <div class="filter-select">
    <label v-if="label" class="filter-select__label">{{ label }}</label>

    <div class="filter-select__input-wrapper" ref="wrapperRef">
      <input
          v-model="query"
          class="filter-select__input"
          :placeholder="placeholder"
          @focus="isFocused = true"
          @blur="handleBlur"
          @keydown.enter.stop.prevent="handleEnter"
      />

      <!-- Выпадающий список -->
      <div
          v-if="isFocused && hasOptions"
          class="filter-select__dropdown"
          @mousedown.prevent
      >
        <div
            v-for="item in filteredItems"
            :key="item"
            class="filter-select__option"
            @click="select(item)"
        >
          {{ item }}
        </div>
        <div v-if="filteredItems.length === 0" class="filter-select__no-results">
          Ничего не найдено
        </div>
      </div>
    </div>

    <!-- Чипы -->
    <div v-if="selected.length" class="filter-select__chips">
      <span
          v-for="item in selected"
          :key="item"
          class="filter-select__chip"
      >
        {{ item }}
        <button type="button" class="filter-select__chip-remove" @click="remove(item)">×</button>
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
  // Задержка, чтобы клик по dropdown успел сработать
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

<style scoped>
.filter-select {
  position: relative;
  width: 100%;
}

.filter-select__label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #334155;
}

.filter-select__input-wrapper {
  position: relative;
}

.filter-select__input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.filter-select__input:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.filter-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #cbd5e1;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.filter-select__option {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.filter-select__option:hover {
  background-color: #f1f5f9;
}

.filter-select__no-results {
  padding: 8px 10px;
  color: #64748b;
  font-size: 14px;
}

.filter-select__chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.filter-select__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e6f2ff;
  color: #1e3a8a;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.filter-select__chip-remove {
  background: transparent;
  border: none;
  color: #1e3a8a;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}


</style>