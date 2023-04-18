<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Message from 'primevue/message'
import type { MessageProps } from 'primevue/message'
import { ref } from 'vue'
const messages = ref([
  { severity: 'info', content: 'Dynamic Info Message' },
  { severity: 'success', content: 'Dynamic Success Message' },
  { severity: 'warn', content: 'Dynamic Warning Message' }
] as IMessage[])
interface IMessage extends MessageProps {
  content: string
}
</script>

<template>
  <header>
    <NavBar></NavBar>
    <transition-group name="p-message" tag="div" class="p-message-container">
      <Message
        v-for="(msg, idx) of messages"
        :key="idx"
        :severity="msg.severity"
        :sticky="false"
        :life="5000"
        >{{ msg.content }}</Message
      >
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
