<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import Tag from 'primevue/tag'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { getStatusStyle } from '@/utils/style'
import MdView from '@/components/MdView.vue'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'
import { useWalletStore } from '@/stores/wallet'
import { Project__factory } from '@/contracts'
import { BigNumber, ethers } from 'ethers'
const wallet = useWalletStore()
const toast = useToast()

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

interface ISolution {
    id: BigNumber
    author: string
    url: string
    voteIpjRatio: number
}
const solutions = reactive<ISolution[]>([])
onMounted(async () => {
    if (!wallet.isConnected) {
        await wallet.connect()
    }
    const project = Project__factory.connect(
        '0xeDa93bDc08c6Ff2e67F8Bc4123eb4a5275E8FDaa',
        wallet.signer!
    )
    // Collect all solution event to get all id
    const events = await project.queryFilter(project.filters.URLSubmitted())
    events.forEach(async (event) => {
        const _solution = await project.solutions(event.args.solutionId)
        solutions.push({
            id: event.args.solutionId,
            author: _solution.author,
            url: _solution.url,
            voteIpjRatio: 0
        })
    })
})

const sendVoteTx = async () => {
    // const projectABI = require('../../../../artifacts/contracts/Project.sol/Project.json')
    if (!wallet.isConnected) {
        await wallet.connect()
        const project = Project__factory.connect(
            '0xeDa93bDc08c6Ff2e67F8Bc4123eb4a5275E8FDaa',
            wallet.signer!
        )
        const voteTxns = solutions.map((solution) => {
            return project.populateTransaction.voteForSolution(solution.id, solution.voteIpjRatio)
        })
        const batchTxn = new ethers.Contract(
            '0xeDa93bDc08c6Ff2e67F8Bc4123eb4a5275E8FDaa',
            '',
            wallet.signer
        ).batch(voteTxns)
        await batchTxn.execute()
    }
}
const handleSubmit = () => {
    if (!checkEnoughIpj(totalVotedIpjRatio.value)) {
        toast.add({
            severity: 'error',
            summary: 'Submit',
            detail: 'Exceed voting coda',
            life: 5000
        })
    } else {
        sendVoteTx()
            .then(() => {
                toast.add({
                    severity: 'success',
                    summary: 'Submit',
                    detail: 'vote',
                    life: 5000
                })
            })
            .catch(() => {
                toast.add({
                    severity: 'error',
                    summary: 'Submit',
                    detail: 'vote contract failed',
                    life: 5000
                })
            })
    }
}

const totalVotedIpjRatio = computed(() => {
    const votedIpj = solutions.reduce((sum, solution) => sum + solution.voteIpjRatio, 0)
    return votedIpj
})
const checkEnoughIpj = (votedIpjRatio: number) => {
    return votedIpjRatio < 100
}
</script>
<template>
    <div class="card mx-4">
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
        <!-- Solution -->
        <div class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between">
            <h4 class="ml-2">Vote</h4>
            <h4>
                <span class="text-xs">Voted</span> {{ totalVotedIpjRatio }}
                <span class="text-xs">%</span>
            </h4>
            <h4><span class="text-xs">Total</span> {{ 100 }} <span class="text-xs">%</span></h4>
            <Button size="small" class="p-btn shadow-3" @click="handleSubmit">Confirm</Button>
        </div>
        <div class="p-body mt-0 p-2 mx-1 flex flex-column gap-3">
            <div v-for="solution in solutions" class="grid">
                <div class="col-12 md:col-8">
                    <Card
                        class="border-round justify-content-center w-full shadow-2 hover:shadow-8"
                        style="background-color: inherit"
                    >
                        <template #header> </template>
                        <template #title> {{ solution.id }} </template>
                        <template #subtitle>{{ solution.author }} </template>
                        <template #content>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
                                sed consequuntur error repudiandae numquam deserunt quisquam
                                repellat libero asperiores earum nam nobis, culpa ratione quam
                                perferendis esse, cupiditate neque quas!
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
                    <InputNumber
                        class="ml-3"
                        v-model="solution.voteIpjRatio"
                        :class="{ 'p-invalid': checkEnoughIpj(solution.voteIpjRatio) }"
                        :useGrouping="false"
                    />
                    <span class="text-xl mx-3">%</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
::v-deep(.p-inputgroup-addon) {
    background-color: rgb(70, 58, 58);
    color: rgb(238, 188, 99);
}
::v-deep(.p-inputnumber-input) {
    background-color: inherit;
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
::v-deep(.p-component) {
    font-family: 'Rubik', sans-serif;
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
</style>
