<script setup lang="ts">

import { reactive, ref } from 'vue'
import MdEditor from '@/components/MdEditor.vue'
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button'
import { uploadToIPFS } from '@/utils/ipfs'
import { zipTextAndFiles, unzipFiles, type FileObject } from '@/utils/helper'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import FileUpload from '@/components/FileUpload.vue'
import { useWalletStore } from '@/stores/wallet'
import { ProjectFactory__factory } from '@/contracts'
import { URLSubmittedEvent } from '@/contracts/Project.sol/Project'
import { BigNumber } from 'ethers'
import router from '@/router'
import {defineEmits} from 'vue'
const emit = defineEmits(['deliver'])
// emit('someFunction')
let isloading = ref(false)
const toast = useToast()
/**
 * Proposal to upload (README.md)
 */
const text = ref(`
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
`)
/**
 * Files to upload
 * - 檔案內容: await file[i].text()
 * - 檔案路徑: file[i].name
 */

const files = ref<File[]>([])


const walletStore = useWalletStore()
/**
 * Stores the given URL on a DAO contract.
 * @param url The URL to store on the DAO contract.
 * @returns A Promise that resolves when the URL has been stored on the DAO contract.
 */
const storeOnProjectContract = async (
    url: string
)=> {
    if (!walletStore.isConnected) {
        await walletStore.connect()
    }
    const factoryAddress = import.meta.env.VITE_PROJECT_FACTORY_ADDRESS as string
    
    const factoryContract = ProjectFactory__factory.connect(factoryAddress, walletStore.signer!)
    emit('deliver', url)
    
   
    
    
}
/**
 * Uploads the given text content to IPFS and stores the resulting URL on a smart contract using the specified function.
 * @param text The text content to upload.
 * @param storeOnContractFunc The function to use for storing the URL on a smart contract.
 */
const handlePublish = () => {
    const fileObjs: FileObject[] = []
    files.value?.forEach(async (file) => {
        fileObjs.push({
            filename: file.name,
            text: await file.text()
        })
    })
    fileObjs.push({
        filename: 'README.md',
        text: text.value
    })
    // Zip the text content and files
    zipTextAndFiles(fileObjs)
        .then((blob) => {
            uploadToIPFS(blob)
                .then((url: string) => {
                    console.log(blob)
                    // Log the uploaded URL to the console
                    toast.add({
                        severity: 'info',
                        summary: 'Success',
                        detail: `File uploaded: ${url} (url)`,
                        life: 5000
                    })
                    console.log(0)
                    storeOnProjectContract(url)
                        .then((address) => {
                            toast.add({
                                severity: 'success',
                                summary: 'Store to contract ' + address,
                                detail: `Tx: `,
                                life: 5000
                            })
                            router.push(`/project/${address}`)
                        })
                        .catch((error: Error) => {
                            // Handle any errors that occur when storing the URL on a smart contract
                            console.error('Error storing file on chain:', error)
                            toast.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: `Error storing file on chain: ${error}`,
                                life: 5000
                            })
                        })
                })
                .catch((error: Error) => {
                    // Handle any errors that occur when uploading the text content to IPFS
                    toast.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Error uploading file to IPFS: ${error}`,
                        life: 5000
                    })
                })
        })
        .catch((error: Error) => {
            // Handle any errors that occur when uploading the text content to IPFS
            toast.add({
                severity: 'error',
                summary: 'Failed',
                detail: `Error uploading file: ${error}`,
                life: 5000
            })
        })
    // Upload the text content to IPFS, and get the resulting URL
}


</script>

<template>
   
    <MdEditor v-model="text"></MdEditor>
    <FileUpload v-model="files"></FileUpload>
    <div class="flex justify-content-center py-6 gap-6">
        <Button
            text
            class="btn shadow-3 text-black-alpha-90 bg-yellow-300 text-l hover:bg-yellow-900 hover:text-yellow-300"
            @click="handlePublish"
            >Publish
        </Button>
        <!-- <Button
            text
            class="btn shadow-3 text-black-alpha-90 hover:surface-700 text-l surface-500 hover:text-50"
            @click="router.push('/')"
            >
        </Button> -->
        <div  v-if="isloading" class="loader">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration="1.5s" aria-label="Custom ProgressSpinner" />
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
.p-input {
    background-color: inherit;
    height: 3rem;
}
</style>
