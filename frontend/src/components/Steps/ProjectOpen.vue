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
//const unirepStore = useUnirepStore()
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

const projectContract = Project__factory.connect("0x460dCe5c50041bf53129449De99C9D6152B3E494",walletStore.signer!)
const handleRegister = async () => {
    // if(unirepStore.isConnected){
    //     await unirepStore.connect("0x460dCe5c50041bf53129449De99C9D6152B3E494")
    //     const signupProof1  = await unirepStore.userState!.genUserSignUpProof()
    //     projectContract.registerDeveloper(signupProof1?.publicSignals,signupProof1?.proof)
    //     identity.value = 1
    // }
    identity.value = 1
}

const handleverify = async () => {
    // if(unirepStore.isConnected){
    //     await unirepStore.connect("0x460dCe5c50041bf53129449De99C9D6152B3E494")
    //     const signupProof1  = await unirepStore.userState!.genUserSignUpProof()
    //     projectContract.verifyDeveloper(signupProof1?.publicSignals,signupProof1?.proof)
    //     identity.value = 2
    // }
    identity.value = 2
}
const identityCheck = async () => {
    if (!walletStore.isConnected)
    {
        walletStore.connect()
    }
    console.log('walletStore.address',walletStore.address)
    const identityNumber = (await projectContract.developers(walletStore.address))
    console.log('identityNumber',identityNumber)
    if (identityNumber == 2)
    {
        identity.value = 2
    }
    else if(identityNumber == 1)
    {
        identity.value = 1
    }
    else
    {
        identity.value = 0
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
    <div v-if="isCheck">
        <br /><br /><br />
        <div class="card flex justify-content-center">
            <Button label="Check your identity" @click="identityCheck"/>
        </div>
        <br />
        <div class="card flex justify-content-center">
            <InlineMessage severity="info"
                >After you claim reward, POAP will send to your wallet !</InlineMessage
            >
        </div>
    </div> 
    <div v-else>
        <div v-if="identity==2">
            <DynamicDialog />
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
            <br /><br /><br />
            <div class="card flex justify-content-center">
                <Button label="Verify" @click="handleverify"/>
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info"
                    >After you claim reward, POAP will send to your wallet !</InlineMessage
                >
            </div>
        </div>
        <div v-else>
            <br /><br /><br />
            <div class="card flex justify-content-center">
                <Button label="Register" @click="handleRegister"/>
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info"
                    >After you claim reward, POAP will send to your wallet !</InlineMessage
                >
            </div>
        </div>
    </div>
                       
</template>
<style scoped>
::v-deep(.p-component) {
    font-family: 'Rubik', sans-serif;
}
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
</style>