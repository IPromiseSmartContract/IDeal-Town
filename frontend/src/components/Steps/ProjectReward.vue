<script setup lang="ts">
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import InlineMessage from 'primevue/inlinemessage'
import { Project__factory } from '@/contracts'
import Card from 'primevue/card'
import { ref, onMounted } from 'vue'

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
        .then()
        .catch((err) => {
            console.error(err)
            alert('Claim reward error!\nYou do not have any reward!!!!')
        })
}
</script>
<template>
    <div class="p-title flex flex-column gap-4 mt-5 p-2 mx-1">
        <h4 class="ml-2">Rewards</h4>
    </div>
    <div class="p-body flex flex-column mt-0 p-2 mx-1 align-items-center gap-3">
        <h4 class="text-xl">
            Now, your reward in this project is {{ amountOfReward }} IDT tokens.
        </h4>

        <Button
            size="small"
            class="p-btn shadow-3 flex justify-content-center mb-2"
            @click="claimReward"
        >
            Claim Your Reward !
        </Button>
    </div>
</template>

<style scoped>
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
.p-btn {
    background-color: rgb(238, 188, 99);
    color: rgb(70, 58, 58);
    border: 0px;
    width: 15rem;
    font-family: 'Allerta Stencil';
}
.p-btn:hover {
    background-color: rgb(70, 58, 58) !important;
    color: rgb(238, 188, 99) !important;
    border: 0px !important;
    font-family: 'Allerta Stencil';
}
</style>
