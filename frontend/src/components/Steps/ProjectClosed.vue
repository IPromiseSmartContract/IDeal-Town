<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import { useField, useForm } from 'vee-validate'
import InlineMessage from 'primevue/inlinemessage'
import { DropResponse } from '../../utils/poap'
import ProgressSpinner from 'primevue/progressspinner';
import axios from 'axios';
import { url } from 'inspector'
const { handleSubmit, resetForm } = useForm()
const { value, errorMessage } = useField('value', validateField)
const toast = useToast()
const items = ref([])
let eventResponse = reactive({} as DropResponse)
let QRhashResponse = reactive({})
let NFTResponse = reactive({})
let isloading = ref(true)

onMounted(
    () => {
        axios.post('http://127.0.0.1:5000/createEvent')
        .then( (resp) => {
            console.log(resp.data)
            eventResponse = resp.data
            isloading.value = false
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
            alert(resp.data)
        })
        .catch((err) => {
            console.error(err)
            alert('QRhash error !')
        })  
}

// lack of qr_hash and address
async function getNFT() {
    const walletStore = useWalletStore()
    let data = {
        "address": walletStore.address,
        "qr_hash": 'QRhashResponse.message'
    }
    axios.post('http://127.0.0.1:5000/mintPOAP', data)
        .then( (resp) => {
            console.log(resp.data)
            NFTResponse = resp.data
        })
        .catch((err) => {
            console.error(err)
            alert('Get POAP error !')
        })  
}

async function doClaim() {
    getQRHash().then(() => getNFT())
}

</script>
<template>
    <div v-if="isloading" class="card flex justify-content-center">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration="1.5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="card flex flex-wrap align-items-center justify-content-center gap-3">
        <InlineMessage severity="success" style="white-space: pre-wrap;" >{{ 
            "Event metadata : " + '\n' + 
            "name : " + eventResponse.name +'\n' + 
            "id : " + eventResponse.id +'\n' + 
            "fancy_id : " + eventResponse.fancy_id +'\n' + 
            "event_template_id : " + eventResponse.event_template_id +'\n' + 
            "description : " + eventResponse.description +'\n' + 
            "country : " + eventResponse.country +'\n' + 
            "city : " + eventResponse.city +'\n' + 
            "start_date : " + eventResponse.start_date +'\n' +
            "end_date : " + eventResponse.end_date +'\n' + 
            "event_url : " + eventResponse.event_url +'\n' + 
            "expiry_date : " + eventResponse.expiry_date +'\n' + 
            "virtual_event : " + eventResponse.virtual_event +'\n' + 
            "from_admin : " + eventResponse.from_admin +'\n' + 
            "private_event : " + eventResponse.private_event
        }}</InlineMessage>
    </div>
    <br /><br />
    <div class="card flex justify-content-center">
        <Button label="Claim POAP !" @click="doClaim" />
    </div>
    <br />
    <div class="card flex justify-content-center">
        <InlineMessage severity="info"
            >POAP will send to your wallet after you successfully claim it !</InlineMessage
        >
    </div>
</template>
