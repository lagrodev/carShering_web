<template>
  <div class="search-input">
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        class="filter-input"
    />
    <span class="icon">🔍</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-input {
  position: relative;
  width: 100%;
}

.search-input input {
  padding-left: 40px;
}

.icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}
</style>