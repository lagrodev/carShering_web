<template>
  <div class="dropdown">
    <label>{{ label }}</label>
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="filter-input"
    >
      <option value="" disabled selected>Select {{ label.toLowerCase() }}</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
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
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}
</style>