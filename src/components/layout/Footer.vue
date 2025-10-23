<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 CarShare. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Support</a>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: #f1f5f9;
  padding: 32px 0;
  margin-top: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.footer-links a {
  margin-left: 20px;
  color: #475569;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>