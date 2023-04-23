<script setup lang="ts">
import { computed, defineAsyncComponent, reactive } from 'vue'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import { getStatusStyle } from '@/utils/style'
import { useWalletStore } from '@/stores/wallet'
import { useUnirepStore } from '@/stores/unirep'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { IDTToken__factory, IPJToken__factory, Project__factory } from '@/contracts'
import { inject } from 'vue'
import MdView from '@/components/MdView.vue'
import DynamicDialog from 'primevue/dynamicdialog'
import { useDialog } from 'primevue/usedialog'
import { ref } from 'vue'
import { URLSubmittedEvent } from '@/contracts/Project.sol/Project'
import router from '@/router'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()

let identity = ref()
let isCheck = ref(true)
let currentIpj = ref(0)
let currentIdt = ref(0)
let inputIdt = ref(0)
let poolIdt = ref(2048)

//const toast = useToast()
const CreateSolution = defineAsyncComponent(() => import('@/views/CreateSolution.vue'))
const unirepStore = useUnirepStore()
const walletStore = useWalletStore()
let isloading = ref(false)
walletStore.connect()
const toast = useToast()

const projectContract = Project__factory.connect(
    route.params.address as string,
    walletStore.signer!
)

const getIpj = () => {
    let ipj: number = 0
    projectContract
        .ipjtoken()
        .then((address) => {
            const ipjContract = IPJToken__factory.connect(address, walletStore.signer!)
            ipjContract
                .balanceOf(walletStore.address)
                .then((ipjb) => {
                    ipj = ipjb.toNumber()
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log(err)
        })
    return ipj
}
const getIdt = () => {
    let idt: number = 0
    projectContract.idt().then((address) => {
        const idtContract = IDTToken__factory.connect(address, walletStore.signer!)
        idtContract
            .balanceOf(route.params.address as string)
            .then((ipjb) => {
                idt = ipjb.toNumber()
            })
            .catch((err) => {
                console.log(err)
            })
    })
    return idt
}
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
    return (currentIpj.value / poolIdt.value) * 100
})
const dialog = useDialog()
const handleSolve = () => {
    dialog.open(CreateSolution, {
        props: {
            modal: true
        },
        emits: {
            onDeliver: (url: string) => {
                // The 'on' prefix and same emit name are required.
                submitURL(url)
                router.push(`project/${route.params.address}`)
            }
        }
    })
}

const handleRegister = async () => {
    await unirepStore.connect(route.params.address as string)
    await unirepStore
        .userState!.genUserSignUpProof()
        .then(async (signupProof1) => {
            return await projectContract.registerDeveloper(
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

const handleVerify = async () => {
    if (!unirepStore.isConnected) {
        await unirepStore.connect(route.params.address as string)
    }
    router.push('/project/0xA6a6B093e646824FfCC8D41D80d569Eb91165e8a')
    // await unirepStore
    //     .userState!.genUserSignUpProof()
    //     .then(async (signupProof1) => {
    //         return await projectContract.verifyDeveloper(
    //             signupProof1?.publicSignals,
    //             signupProof1?.proof
    //         )
    //     })
    //     .then(async (tx) => {
    //         isloading.value = true
    //         await tx.wait()
    //         isloading.value = false
    //         identityCheck()
    //     })
}
const identityCheck = async () => {
    if (!walletStore.isConnected) {
        walletStore.connect()
    }
    identity.value = await projectContract.developers(walletStore.address)
    console.log(identity.value)
    isCheck.value = false
}
const submitURL = async (url: string): Promise<any> => {
    //TODO: Implementation details for storing the URL on a DAO contract go here @skyline9981
    const tx = await projectContract.submitURL(url)
    const receipt = await tx.wait()
    const event = receipt.events?.[0].args as URLSubmittedEvent | undefined
    if (!event) {
        toast.add({
            severity: 'error',
            summary: 'Failed to store URL',
            detail: 'URL could not be stored on the DAO contract.',
            life: 5000
        })
        return
    }
    toast.add({
        severity: 'success',
        summary: 'URL stored on the DAO contract',
        detail: `Tx: ${tx.hash}`,
        life: 5000
    })
    return
}
const handleJoin = () => {
    currentIdt.value -= inputIdt.value
    currentIpj.value += inputIdt.value
}
const handleRefresh = () => {
    currentIdt.value = 1012
    currentIpj.value = 0
}
//function is
</script>

<template>
    <div v-if="isCheck" class="p-section flex flex-column gap-6 p-6">
        <div class="card flex justify-content-center">
            <InlineMessage class="text-6xl" severity="info">Let's get starting </InlineMessage>
        </div>
        <div class="card flex justify-content-center">
            <Button
                size="large"
                label="Check your identity"
                class="p-card shadow-3 text-3xl"
                @click="identityCheck"
            />
        </div>
    </div>
    <div v-else class="flex flex-column p-6">
        <div v-if="identity === 2">
            <DynamicDialog />
            <div class="card">
                <div class="p-title grid">
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
                        <div
                            class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between"
                        >
                            <h4>Solution</h4>
                            <Button size="small" class="p-btn shadow-3" @click="handleSolve"
                                >Solve</Button
                            >
                        </div>
                        <div
                            class="p-body grid mt-0 p-2 mx-1 align-items-center justify-content-center"
                        >
                            <h4 class="text-xl p-3">Submit your solution and get IDT!!</h4>
                        </div>
                    </div>
                    <!-- Register -->
                    <div class="col-12 md:col-6">
                        <div
                            class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between"
                        >
                            <h4>My Position</h4>
                            <Button size="small" class="p-btn shadow-3" @click="handleRefresh"
                                >Refresh</Button
                            >
                        </div>
                        <div class="p-body mt-0 p-2 mx-1 grid">
                            <div class="col-12">
                                <ProgressBar :value="ipjRatio"
                                    >{{ currentIpj }}/{{ poolIdt }}</ProgressBar
                                >
                            </div>
                            <div class="col-12 md:col-6">
                                <div
                                    class="flex p-6 flex-column align-items-center justify-content-center h-4rem"
                                >
                                    <div class="text-xl">IPJ</div>
                                    <div class="font-bold text-5xl">{{ currentIpj }}</div>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div
                                    class="flex p-6 flex-column align-items-center justify-content-center h-4rem"
                                >
                                    <div class="text-xl">IDT</div>
                                    <div class="font-bold text-5xl">{{ currentIdt }}</div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div
                                    class="flex flex-column align-items-center justify-content-center mt-5 gap-3"
                                >
                                    <div class="p-inputgroup w-full">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-dollar"></i>
                                        </span>
                                        <InputNumber v-model="inputIdt" placeholder="Price" />
                                    </div>
                                    <Button size="small" class="p-btn shadow-3" @click="handleJoin"
                                        >Join</Button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="identity === 1">
            <div class="card flex justify-content-center">
                <Button label="Verify" class="p-btn shadow-3" @click="handleVerify" />
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info" class="text-3xl"
                    >you have to verify your account on unirep !</InlineMessage
                >
            </div>
        </div>
        <div v-else>
            <div class="card flex justify-content-center">
                <Button label="Register" class="p-btn shadow-3" @click="handleRegister" />
            </div>
            <br />
            <div class="card flex justify-content-center">
                <InlineMessage severity="info" class="text-3xl"
                    >Before starting, you need to register as an developer first !</InlineMessage
                >
            </div>
        </div>
    </div>
    <div v-if="isloading" class="loader">
        <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration="1.5s"
            aria-label="Custom ProgressSpinner"
        />
    </div>
</template>
<style scoped>
.p-section {
    margin-top: 15%;
}
.loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
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
.p-btn {
    background-color: rgb(70, 58, 58);
    color: rgb(238, 188, 99);
    border: 1px solid rgb(238, 188, 99);
    font-family: 'Allerta Stencil';
}
.p-btn:hover {
    background-color: rgb(136, 114, 114) !important;
    color: rgb(238, 188, 99) !important;
    border: 0px !important;
    font-family: 'Allerta Stencil';
}
</style>
