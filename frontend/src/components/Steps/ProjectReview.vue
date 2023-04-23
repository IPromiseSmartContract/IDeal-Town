<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import Tag from 'primevue/tag'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import { getStatusStyle } from '@/utils/style'
import MdView from '@/components/MdView.vue'
import { genEpochKey } from '@unirep/utils'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'
import { Project__factory } from '@/contracts'
import { useWalletStore } from '@/stores/wallet'
import { ethers } from 'ethers'
import { Unirep__factory } from '@unirep/contracts/typechain'
import { useUnirepStore } from '@/stores/unirep'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
const toast = useToast()
let isloading = ref(false)

const wallet = useWalletStore()
const unirep = useUnirepStore()
const project = reactive({
    name: 'Project name',
    mdContent: `
# Proposal

### Introduction
This proposal outlines a large-scale project that aims to meet a specific set of requirements. The project will involve several key components and will require a team of experienced professionals to complete.

### Project Overview
The project aims to create a comprehensive software platform that can be used to manage a wide range of business operations. This will involve developing several key modules, including:

- Inventory management module
- Sales and marketing module
- Accounting and finance module
- Human resources module
- Customer relationship management (CRM) module

### Requirements
- Customizable dashboards and reports
- Multi-user support with role-based access control
- Integration with third-party tools and services
- Automated data backups and disaster recovery
- Advanced security features, including data encryption and user authentication
`,
    address: 'ox2561521',
    status: 'active',
    currentIpj: 1000
})
const progressingStr = ref('Before starting, you need to regist a unirep account first !')
interface ISolution {
    id: number
    name: string
    link: string
    voteIpj: number
    review: Option
}
interface Option {
    icon: string
    value: 'up' | 'down'
}
const options = ref<Option[]>([
    { icon: 'pi pi-thumbs-up-fill', value: 'up' },
    { icon: 'pi pi-thumbs-down-fill', value: 'down' }
])
// const getOption = (review: 'Up' | 'Down'): Option => {
//     const option = options.value.find((opt) => opt.value === review)
//     return option || { icon: 'pi pi-thumbs-up-fill', value: 'Up' }
// }
const route = useRoute()

const projectContract = Project__factory.connect(route.params.address as string, wallet.signer!)
let identity = ref()
let isCheck = ref(true)

const identityCheck = async () => {
    if (!wallet.isConnected) {
        wallet.connect()
    }
    identity.value = await projectContract.reviewers(wallet.address)
    isCheck.value = false
}
interface TempSolution {
    name: string
    review: Option
}
const solutions = reactive<TempSolution[]>([
    { name: 'Solution 1', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 2', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 3', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 4', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 5', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 6', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 7', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } },
    { name: 'Solution 8', review: { icon: 'pi pi-thumbs-up-fill', value: 'up' } }
])
const handleRegister = async () => {
    await unirep.connect(route.params.address as string)
    await unirep
        .userState!.genUserSignUpProof()
        .then(async (signupProof1) => {
            return await projectContract.registerReviewer(
                signupProof1?.publicSignals,
                signupProof1?.proof
            )
        })
        .then(async (tx) => {
            isloading.value = true
            await tx.wait()
            isloading.value = false
            identityCheck()
        })
}
// const sendReviewTx = async () => {
//     // const projectABI = require('../../../../artifacts/contracts/Project.sol/Project.json')
//     if (!wallet.isConnected) {
//         await wallet.connect()
//     }
//     if (!unirep.isConnected) {
//         await unirep.connect(route.params.address as string)
//     }
//     const unirep_ = Unirep__factory.connect(
//         import.meta.env.VITE_UNIREP_ADDRESS as string,
//         wallet.signer!
//     )
//     const epoch = await unirep_.attesterEpochLength(route.params.address as string)
//     const epochKey = genEpochKey(
//         unirep.id?.secret!,
//         unirep.userState?.sync.attesterId!,
//         epoch.toBigInt(),
//         0
//     )

//     const reviewTxns = solutions.map((solution) => {
//         return projectContract.populateTransaction.review(
//             epochKey,
//             epoch.toBigInt(),
//             solution.review.value === 'Up' ? 0 : 1,
//             10
//         )
//     })
//     const batchTxn = new ethers.Contract(route.params.address as string, '', wallet.signer).batch(
//         reviewTxns
//     )
//     await batchTxn.execute()
// }
// const handleSubmit = () => {
//     sendReviewTx()
//         .then(() => {
//             toast.add({
//                 severity: 'success',
//                 summary: 'Submit',
//                 detail: 'vote',
//                 life: 5000
//             })
//         })
//         .catch(() => {
//             toast.add({
//                 severity: 'error',
//                 summary: 'Submit',
//                 detail: 'vote contract failed',
//                 life: 5000
//             })
//         })
// }
const totalGoodSolution = computed(() => {
    return solutions.reduce((sum, solution) => {
        if (solution.review.value == 'up') {
            return sum + 1
        } else {
            return sum
        }
    }, 0)
})
const handleMockRegister = () => {
    isloading.value = true
    progressingStr.value = 'Sending transactions ...'
    setTimeout(() => {
        isloading.value = false
        toast.add({
            severity: 'success',
            summary: 'Reviewer register OK',
            detail: 'register',
            life: 5000
        })
        progressingStr.value = 'Transactions successfully'
    }, 5000)
}
const handleSubmit = () => {
    isloading.value = true
    setTimeout(() => {
        isloading.value = false
        toast.add({
            severity: 'success',
            summary: 'Batch Vote OK',
            detail: 'vote',
            life: 5000
        })
    }, 5000)
}
</script>
<template>
    <div v-if="isCheck" class="flex flex-column gap-6 mx-8 p-6">
        <div class="p-section">
            <div class="card flex justify-content-center">
                <InlineMessage severity="info" class="text-4xl">{{ progressingStr }}</InlineMessage>
            </div>
            <div class="card flex justify-content-center">
                <Button
                    label="Register"
                    class="p-btn shadow-3 text-3xl mt-6"
                    @click="handleMockRegister"
                />
            </div>
            <br />
        </div>
        <div>
            <div class="p-title grid mt-5 p-1 mx-1">
                <div class="col-12 md:col-8 flex gap-3">
                    <h4>{{ project.name }}</h4>
                    <Tag :style="getStatusStyle(project.status)">{{ project.status }} </Tag>
                </div>
                <div class="col-12 md:col-4 flex justify-content-end"></div>
            </div>
            <div class="p-body grid mt-0 p-2 mx-1">
                <MdView v-model="project.mdContent"></MdView>
            </div>
        </div>
    </div>
    <!-- v-if="identity === 2" -->
    <div class="p-title flex mt-5 p-2 mx-1 align-items-center justify-content-between">
        <div class="card flex justify-content-center">
            <InlineMessage class="text-6xl" severity="success">Review</InlineMessage>
        </div>
        <h4><span class="text-xs">Good</span> {{ totalGoodSolution }}</h4>
        <h4><span class="text-xs">Bad</span> {{ solutions.length - totalGoodSolution }}</h4>
        <Button
            icon="pi pi-search"
            :loading="isloading"
            size="large"
            class="p-btn shadow-3 text-3xl"
            @click="handleSubmit"
            label="Confirm"
        ></Button>
    </div>
    <div class="p-body flex flex-column p-2 mx-1 gap-6 m-12em">
        <div v-for="solution in solutions" class="grid">
            <div class="col-12 md:col-8">
                <Card
                    class="border-round justify-content-center w-full shadow-2 hover:shadow-8"
                    style="background-color: inherit"
                >
                    <template #header> </template>
                    <template #title> {{ solution.name }} </template>
                    <template #subtitle> </template>
                    <template #content>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                            consequuntur error repudiandae numquam deserunt quisquam repellat libero
                            asperiores earum nam nobis!
                        </p>
                    </template>
                    <template #footer>
                        <div class="flex justify-content-center card-container gap-4">
                            <Button
                                icon="pi pi-times"
                                label="More"
                                style="background-color: rgba(70, 58, 58, 0.8)"
                            />
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-12 md:col-4 flex justify-content-center align-items-center">
                <SelectButton
                    v-model="solution.review"
                    :options="options"
                    optionLabel="value"
                    dataKey="value"
                    aria-labelledby="custom"
                >
                    <template #option="slotProps">
                        <i :class="slotProps.option.icon"></i>
                    </template>
                </SelectButton>
            </div>
        </div>
    </div>
</template>
<style scoped>
.loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
}
::v-deep(.p-component) {
    font-family: 'Rubik', sans-serif;
}
::v-deep(.p-inputgroup-addon) {
    background-color: rgb(70, 58, 58);
    color: rgb(238, 188, 99);
}
::v-deep(.p-selectbutton .p-button.p-highlight) {
    background-color: inherit;
    background: rgb(238, 188, 99);
    border: 0px;
    color: rgb(70, 58, 58);
}
::v-deep(.p-selectbutton .p-button.p-highlight):hover {
    background-color: inherit;
    background: rgb(70, 58, 58);
    border: 0px;
    color: rgb(238, 188, 99);
}
::v-deep(.p-progressbar-value) {
    background-color: rgb(70, 58, 58) !important;
}
::v-deep(.p-progressbar) {
    background-color: rgb(70, 58, 58, 0.4) !important;
}
::v-deep(.p-progressbar-label) {
    color: rgb(238, 188, 99) !important;
    font-size: small;
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
    font-family: 'Allerta Stencil';
}
.p-btn:hover {
    background-color: rgb(70, 58, 58) !important;
    color: rgb(238, 188, 99) !important;
    border: 0px !important;
    font-family: 'Allerta Stencil';
}

.v-sol {
    height: 3rem;
    width: 100%;
    border: 1px solid;
}

.p-card {
    background-color: rgb(238, 188, 99);
    color: rgb(70, 58, 58);
    width: 40rem;
    font-family: 'Allerta Stencil';
}
/* .p-card:hover {
    background-color: rgb(238, 188, 99) !important;
    color: rgb(70, 58, 58) !important;
    border: 1px solid rgb(238, 188, 99) !important;
    width: 40rem !important;
    font-family: 'Allerta Stencil' !important;
} */
.p-section {
    margin-top: 15%;
    margin-bottom: 15%;
}
</style>
