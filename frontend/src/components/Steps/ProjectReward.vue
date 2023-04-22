<script setup lang="ts">
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import InlineMessage from 'primevue/inlinemessage'
import { Project__factory } from '@/contracts'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import DynamicDialog from 'primevue/dynamicdialog'
import { useDialog } from 'primevue/usedialog'

const dialog = useDialog()
const toast = useToast()
const walletStore = useWalletStore()
const projectContract = Project__factory.connect(
    '0xfF848793EB02E9D59900a3E44aD0c14ED5c553DF',
    walletStore.signer!
)

const amountOfReward = ref('')

async function getAmountOfReward() {
    const amount = projectContract
        .rewards(walletStore.address)
        .then((resp) => {
            console.log(resp)
            amountOfReward.value = amount.toString()
        })
        .catch((err) => {
            console.error(err)
            amountOfReward.value = '0'
        })
}

onMounted(() => {
    getAmountOfReward()
})

async function checkWallet() {
    if (!walletStore.isConnected) {
        walletStore.connect()
    }
    await projectContract.claimReward()
}

async function claimReward() {
    checkWallet()
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Claim reward',
                detail: `You get ${amountOfReward} IDT tokens.`,
                life: 5000
            })
        })
        .catch(() => {
            toast.add({
                severity: 'error',
                summary: 'Claim reward',
                detail: 'You do not have any reward in this project!',
                life: 5000
            })
        })
}
</script>
<template>
    <div class="p-section flex flex-column gap-6 p-6">
        <div class="card flex justify-content-center text-6xl">
            Now, your reward in this project is {{ amountOfReward }} IDT tokens.
        </div>
        <div class="card flex justify-content-center">
            <Button
                size="large"
                label="Claim Your Reward !"
                class="p-card shadow-3 text-3xl"
                @click="claimReward"
            />
        </div>
    </div>
</template>

<style scoped>
.p-section {
    margin-top: 15%;
}
.p-title {
    border: 2px solid rgb(70, 58, 58);
    color: rgb(59, 48, 48);
    font-size: x-large;
    font-family: 'Rubik', sans-serif;
}
.p-body {
    border: 1px solid rgb(70, 58, 58);
    border-top: 0px;
}
.p-card {
    background-color: rgb(70, 58, 58);
    color: rgb(238, 188, 99);
    border: 1px solid rgb(238, 188, 99);
    width: 40rem;
    font-family: 'Allerta Stencil';
}
.p-card:hover {
    background-color: rgb(238, 188, 99) !important;
    color: rgb(70, 58, 58) !important;
    border: 1px solid rgb(238, 188, 99) !important;
    width: 40rem !important;
    font-family: 'Allerta Stencil' !important;
}
</style>
