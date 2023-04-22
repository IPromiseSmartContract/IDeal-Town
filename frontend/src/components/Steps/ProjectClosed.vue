<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import { useField, useForm } from 'vee-validate'
import InlineMessage from 'primevue/inlinemessage'
import axios from 'axios';
import { url } from 'inspector'
const { handleSubmit, resetForm } = useForm()
const { value, errorMessage } = useField('value', validateField)
const toast = useToast()
const items = ref([])
let eventResponse = reactive({})
let QRhashResponse = reactive([{}])
let NFTResponse = reactive({})

onMounted(
    () => {
        axios.post('http://127.0.0.1:5000/createEvent')
        .then( (resp) => {
            console.log(resp.data)
            eventResponse = resp.data
        })
        .catch((err) => {
            console.error(err)
            alert('Event error !')
        })        
    }    
) 

function validateField(value) {
    if (!value) {
        return 'id is required.'
    }
    return true
}

async function getQRHash() {
    axios.post('http://127.0.0.1:5000/getqrHash')
        .then( (resp) => {
            console.log(resp.data)
            QRhashResponse = resp.data
        })
        .catch((err) => {
            console.error(err)
            alert('Event error !')
        })  
}

// lack of qr_hash and address
async function getNFT() {
    const walletStore = useWalletStore()
    let data = {
        "address": walletStore.address,
        "qr_hash": ""
    }
    axios.post('http://127.0.0.1:5000/mintPOAP', data)
        .then( (resp) => {
            console.log(resp.data)
            NFTResponse = resp.data
        })
        .catch((err) => {
            console.error(err)
            alert('Event error !')
        })  
}

async function doClaim() {
    getQRHash().then(() => getNFT())
}

</script>
<template>
    <br /><br /><br /><br /><br />
    <div class="card flex justify-content-center">
        <Button label="Claim POAP !" @click="doClaim" />
    </div>
    <br />
    <div class="card flex justify-content-center">
        <InlineMessage severity="info"
            >After you claim reward, POAP will send to your wallet !</InlineMessage
        >
    </div>
</template>
