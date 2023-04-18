<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { bloctoSDK } from '../utils/blockto'
const address = ref<string>('')

const loginHandler = async () => {
  const accounts = await bloctoSDK?.ethereum?.enable()
  if (accounts) {
    address.value = accounts[0]
  }
}

const logoutHandler = async () => {
  try {
    await bloctoSDK?.ethereum?.request({ method: 'wallet_disconnect' })
    localStorage.removeItem('sdk.session')
    address.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div v-if="address">
    <Button @click="logoutHandler">Logout</Button>
    <p>address: {address}</p>
  </div>
  <div v-else>
    <Button @click="loginHandler">Blocto</Button>
  </div>
</template>
