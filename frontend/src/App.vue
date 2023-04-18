<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <header>
    <NavBar></NavBar>
    <transition-group name="p-message" tag="div" class="p-message-container">
      <Toast style="transform: translateY(70px); /* 等同于 translate(10px) */" />
    </transition-group>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.p-message-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 30%;
}
main {
  padding: 20px;
}
</style>
