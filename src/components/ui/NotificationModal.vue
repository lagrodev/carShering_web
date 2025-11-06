<template>
  <Transition name="modal-fade">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <!-- Header -->
        <div 
          :class="[
            'px-6 py-4 rounded-t-2xl flex items-center justify-between',
            typeClass
          ]"
        >
          <div class="flex items-center gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <svg v-if="type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <!-- Title -->
            <h3 class="text-lg font-bold">{{ title }}</h3>
          </div>
          
          <button
            v-if="!confirmMode"
            @click="handleClose"
            class="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <p class="text-gray-700 leading-relaxed">{{ message }}</p>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6">
          <div v-if="confirmMode" class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[
                'flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-colors shadow-md',
                confirmButtonClass
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
          <button
            v-else
            @click="handleClose"
            :class="[
              'w-full px-4 py-3 text-white font-semibold rounded-xl transition-colors shadow-md',
              buttonClass
            ]"
          >
            {{ closeText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'Уведомление'
  },
  message: {
    type: String,
    required: true
  },
  confirmMode: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'Подтвердить'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  closeText: {
    type: String,
    default: 'Закрыть'
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const typeClass = computed(() => {
  const classes = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return classes[props.type] || classes.info
})

const buttonClass = computed(() => {
  const classes = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }
  return classes[props.type] || classes.info
})

const confirmButtonClass = computed(() => {
  if (props.type === 'error' || props.type === 'warning') {
    return 'bg-red-600 hover:bg-red-700'
  }
  return 'bg-primary-600 hover:bg-primary-700'
})

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.95);
}
</style>
