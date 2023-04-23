<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { useWalletStore } from '../../stores/wallet'
import { useField, useForm } from 'vee-validate'
import InlineMessage from 'primevue/inlinemessage'
import { DropResponse } from '../../utils/poap'
import ProgressSpinner from 'primevue/progressspinner'
import Image from 'primevue/image'
import axios from 'axios'
import { url } from 'inspector'
const { handleSubmit, resetForm } = useForm()
const { value, errorMessage } = useField('value', validateField)
const toast = useToast()
const items = ref([])
let eventResponse = reactive({} as DropResponse)
let QRhashResponse = reactive({})
let NFTResponse = reactive({})
let isloading = ref(true)

onMounted(() => {
    axios
        .post('http://127.0.0.1:5000/createEvent')
        .then((resp) => {
            console.log(resp.data)
            eventResponse = resp.data
            isloading.value = false
        })
        .catch((err) => {
            console.error(err)
            alert('Event error !')
        })
})

function validateField(value) {
    if (!value) {
        return 'id is required.'
    }
    return true
}

async function getQRHash() {
    axios
        .post('http://127.0.0.1:5000/getqrHash')
        .then((resp) => {
            console.log(resp.data)
            QRhashResponse = resp.data
            toast.add({
                severity: 'error',
                summary: 'QR hash error',
                detail: resp.data,
                life: 5000
            })
        })
        .catch((err) => {
            console.error(err)
            toast.add({
                severity: 'error',
                summary: 'QR hash error',
                detail: resp.data,
                life: 5000
            })
        })
}

// lack of qr_hash and address
async function getNFT() {
    const walletStore = useWalletStore()
    let data = {
        address: walletStore.address,
        qr_hash: 'QRhashResponse.message'
    }
    axios
        .post('http://127.0.0.1:5000/mintPOAP', data)
        .then((resp) => {
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
        <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration="1.5s"
            aria-label="Custom ProgressSpinner"
        />
    </div>

    <div v-else class="card flex flex-wrap align-items-center justify-content-center gap-3 p-4">
        <Image src="https://i.imgur.com/g2aXdAP.png" alt="Image" width="350" preview class="mr-8">
            <template #indicator>
                <i class="pi pi-check"></i>
            </template>
        </Image>
        <InlineMessage severity="success" style="white-space: pre-wrap">{{
            'Event metadata : ' +
            '\n' +
            'name : ' +
            eventResponse.name +
            '\n' +
            'id : ' +
            eventResponse.id +
            '\n' +
            'fancy_id : ' +
            eventResponse.fancy_id +
            '\n' +
            'event_template_id : ' +
            eventResponse.event_template_id +
            '\n' +
            'description : ' +
            eventResponse.description +
            '\n' +
            'country : ' +
            eventResponse.country +
            '\n' +
            'city : ' +
            eventResponse.city +
            '\n' +
            'start_date : ' +
            eventResponse.start_date +
            '\n' +
            'end_date : ' +
            eventResponse.end_date +
            '\n' +
            'event_url : ' +
            eventResponse.event_url +
            '\n' +
            'expiry_date : ' +
            eventResponse.expiry_date +
            '\n' +
            'virtual_event : ' +
            eventResponse.virtual_event +
            '\n' +
            'from_admin : ' +
            eventResponse.from_admin +
            '\n' +
            'private_event : ' +
            eventResponse.private_event
        }}</InlineMessage>
    </div>
    <div class="card flex flex-column justify-content-center align-items-center gap-6 p-6">
        <Button
            size="large"
            class="p-card shadow-3 flex mb-2"
            @click="doClaim"
            label="Claim POAP !"
        />
        <InlineMessage severity="info"
            >POAP will send to your wallet after you successfully claim it !</InlineMessage
        >
    </div>
</template>

<style scoped>
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
.p-image {
    height: 70%;
}
</style>
