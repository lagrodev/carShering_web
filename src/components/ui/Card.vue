<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hover: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  shadow: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200'
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const hoverClass = props.hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''
  
  return [
    baseClasses,
    paddingClasses[props.padding],
    shadowClasses[props.shadow],
    hoverClass
  ].filter(Boolean).join(' ')
})
</script>
