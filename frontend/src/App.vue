<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { provide, ref } from 'vue'
import { useWalletStore } from './stores/wallet'
import MetaMaskSvg from '@/components/icons/MetaMask.vue'
const showLoginOpt = ref(false)
const walletStore = useWalletStore()
function toggleLogin(): void {
    showLoginOpt.value = !showLoginOpt.value
}
provide('dialog', {
    showLoginOpt,
    toggleLogin
})
const handleConnect = () => {
    toggleLogin()
    walletStore.connect()
}
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
    <Dialog v-model:visible="showLoginOpt" header="Connect wallet" modal :style="{ width: '30vw' }">
        <div class="flex flex-column card-container gap-4">
            <Button
                class="wallet-btn p-3 flex align-items-center justify-content-center gap-2"
                @click="handleConnect"
            >
                <MetaMaskSvg />
                MetaMask
            </Button>
            <Button class="wallet-btn p-3 flex align-items-center justify-content-center" disabled>
                TT Wallet
            </Button>
        </div>
    </Dialog>
</template>

<style scoped>
::v-deep(.p-component) {
    font-family: 'Rubik', sans-serif;
}
.wallet-btn {
    background-color: rgba(70, 58, 58, 0.8);
    border: 0;
    font-weight: 500;
    color: #eebc63;
    font-family: 'Allerta Stencil';
}
.wallet-btn:hover {
    background-color: rgb(70, 58, 58, 1) !important;
    color: #eebc63 !important;
    border: 0px;
}
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
