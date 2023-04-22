<script setup lang="ts">
import { computed, defineAsyncComponent, reactive } from 'vue'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import { getStatusStyle } from '@/utils/style'
import { useWalletStore } from '@/stores/wallet'
import { useUnirepStore } from '@/stores/unirep'

import { useToast } from 'primevue/usetoast'
import { Project__factory } from '@/contracts'

import MdView from '@/components/MdView.vue'
import DynamicDialog from 'primevue/dynamicdialog'
import { useDialog } from 'primevue/usedialog'
import {ref} from 'vue'
import { URLSubmittedEvent } from '@/contracts/Project.sol/Project'
//const toast = useToast()
const CreateProject = defineAsyncComponent(() => import('@/views/CreateProject.vue'))
const unirepStore = useUnirepStore()
const walletStore = useWalletStore()
walletStore.connect()
const toast = useToast()
const wallet = reactive({
    idt: 120,
    ipj: 200
})
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
const ipjRatio = computed(() => {
    return (wallet.ipj / project.currentIpj) * 100
})
const dialog = useDialog()
const handleSolve = () => {
    dialog.open(CreateProject, {
        props: {
            modal: true
        }
    })
}

const projectContract = Project__factory.connect("0xb94AC6f84689A1BFc60CCFB640FF27AC147BAadf",walletStore.signer!)
const handleRegister = async () => {
    if(!unirepStore.isConnected){
        await unirepStore.connect("0xb94AC6f84689A1BFc60CCFB640FF27AC147BAadf")
    }
    const signupProof1  = await unirepStore.userState!.genUserSignUpProof()
    projectContract.registerDeveloper(signupProof1?.publicSignals,signupProof1?.proof)
    const identityNumber = (await projectContract.developers(walletStore.address))
    identity.value = identityNumber
}

const handleverify = async () => {
    if(!unirepStore.isConnected){
        await unirepStore.connect("0xb94AC6f84689A1BFc60CCFB640FF27AC147BAadf")
    }
    const signupProof1  = await unirepStore.userState!.genUserSignUpProof()
    const identityNumber = (await projectContract.developers(walletStore.address))
    projectContract.verifyDeveloper(signupProof1?.publicSignals,signupProof1?.proof)
    identity.value = identityNumber
    //identity.value = 2
}
const identityCheck = async () => {
    if (!walletStore.isConnected)
    {
        walletStore.connect()
    }
    //console.log('walletStore.address',walletStore.address)
    const identityNumber = (await projectContract.developers(walletStore.address))
    //console.log('identityNumber',identityNumber)
    if (identityNumber == 2)
    {
        identity.value = identityNumber
    }
    else if(identityNumber == 1)
    {
        identity.value = identityNumber
    }
    else
    {
        identity.value = identityNumber
    }
    isCheck.value = false
}
const submitURL = async (url: string): Promise<any> => {
  //TODO: Implementation details for storing the URL on a DAO contract go here @skyline9981
    const tx = await projectContract.submitURL(url)
    const receipt = await tx.wait()
    const event = receipt.events?.[0].args as URLSubmittedEvent | undefined
    if(!event){
        toast.add({ severity: 'error', summary: 'Failed to store URL', detail: 'URL could not be stored on the DAO contract.' })
        return
    }
    toast.add({ severity:'success', summary: 'URL stored on the DAO contract', detail: `Tx: ${tx.hash}` })
    return 
    }

//function is

let identity =ref()
let isCheck =ref(true)


function checkIdentity() {
    identity.value = 0
}



</script>

<template>
    <div v-if="isCheck" class="flex flex-column gap-4 p-6">
    
        <div class="card flex justify-content-center">
            <Button label="Check your identity" class="p-btn shadow-3" @click="identityCheck"/>
        </div>
        <div class="card flex justify-content-center">
            <InlineMessage class="text-3xl" severity="info" 
                >Let's get starting </InlineMessage
            >
        </div>
    </div> 
    <div v-else class="flex flex-column p-6">
        <div v-if="identity==2">
            <DynamicDialog />
            <div class="card ">
                <div class="p-title grid ">
                    <div class="col-12 md:col-8 flex gap-3">
                        <h4>{{ project.name }}</h4>
                        <Tag :style="getStatusStyle(project.status)">{{ project.status }} </Tag>
                    </div>
                    <div class="col-12 md:col-4 flex justify-content-end"></div>
                </div>
                <div class="p-body grid mt-0 p-2 mx-1">
                    <MdView v-model="project.mdContent"></MdView>
                </div>
                <div class="grid">
                    <!-- Solution -->
                    <div class="col-12 md:col-6">
                        <div class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between">
                            <h4>Solution</h4>
                            <Button size="small" class="p-btn shadow-3" @click="handleSolve">Solve</Button>
                        </div>
                        <div class="p-body grid mt-0 p-2 mx-1 align-items-center justify-content-center">
                            <h4 class="text-xl p-3">Submit your solution and get IDT!!</h4>
                        </div>
                    
                    </div>
                    <!-- Register -->
                    <div class="col-12 md:col-6">
                        <div class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between">
                            <h4>My Position</h4>
                            <Button size="small" class="p-btn shadow-3">Connect</Button>
                        </div>
                        <div class="p-body mt-0 p-2 mx-1 grid">
                            <div class="col-12">
                                <ProgressBar :value="ipjRatio"
                                    >{{ wallet.ipj }}/{{ project.currentIpj }}</ProgressBar
                                >
                            </div>
                            <div class="col-12 md:col-6">
                                <div
                                    class="flex p-6 flex-column align-items-center justify-content-center h-4rem"
                                >
                                    <div class="text-xl">IPJ</div>
                                    <div class="font-bold text-5xl">{{ wallet.ipj }}</div>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div
                                    class="flex p-6 flex-column align-items-center justify-content-center h-4rem"
                                >
                                    <div class="text-xl">IDT</div>
                                    <div class="font-bold text-5xl">{{ wallet.idt }}</div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div
                                    class="flex flex-column align-items-center justify-content-center mt-5 gap-3"
                                >
                                    <div class="p-inputgroup w-full">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-bitcoin"></i>
                                        </span>
                                        <InputNumber placeholder="Price" />
                                    </div>
                                    <Button size="small" class="p-btn shadow-3">Join</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        <div v-else-if="identity==1">
            <div class="card flex justify-content-center">
                <Button label="Verify" class="p-btn shadow-3" @click="handleverify"/>
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info" class="text-3xl"
                    >ou have to verify you acoount on unirep !</InlineMessage
                >
            </div>
        </div>
        <div v-else>
            <div class="card flex justify-content-center">
                <Button label="Register" class="p-btn shadow-3" @click="handleRegister"/>
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info" class="text-3xl"
                    >Before starting, you need to regist a unirep account first !</InlineMessage
                >
            </div>
        </div>
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
