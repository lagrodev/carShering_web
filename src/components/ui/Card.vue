<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.card {
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>