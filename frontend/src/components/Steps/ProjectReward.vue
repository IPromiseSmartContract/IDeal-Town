<script setup lang="ts">
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import InlineMessage from 'primevue/inlinemessage'
import { Project__factory } from '@/contracts'
import Card from 'primevue/card';
import { ref, onMounted } from 'vue'

const walletStore = useWalletStore()
const projectContract = Project__factory.connect('0xfF848793EB02E9D59900a3E44aD0c14ED5c553DF', walletStore.signer!)

const amountOfReward = ref('')

async function getAmountOfReward(){
    const amount = projectContract.rewards(walletStore.address)
    .then((resp) => {
        console.log(resp)
        amountOfReward.value = amount.toString()
    })
    .catch((err) => {
        console.error(err)
        amountOfReward.value = '0'
    })
}

onMounted(
    () => {
        getAmountOfReward()
    }
)

async function checkWallet(){
    if(!walletStore.isConnected){
        walletStore.connect()
    }
    await projectContract.claimReward()
}

async function claimReward(){
    await checkWallet()
}

</script>
<template>
    <Card>
    <template #title> Reward </template>
    <template #content>
        <p>
            Now, your reward in this project is {{ amountOfReward }}
        </p>
    </template>
    </Card>
    <br /><br />
    <div class="card flex justify-content-center">
        <Button label="Claim Reward !" @click="claimReward" />
    </div>
    <br />
    <div class="card flex justify-content-center">
        <InlineMessage severity="info">After you claim reward, reward will send to your wallet !</InlineMessage>
    </div>
</template>

