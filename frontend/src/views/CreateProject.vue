<script setup lang="ts">
import { ref } from 'vue'
import MdEditor from '@/components/MdEditor.vue'
import Button from 'primevue/button'
import { uploadToIPFS } from '@/utils/ipfs'
import { useToast } from 'primevue/usetoast'
import router from '@/router'
import FileUpload from '@/components/FileUpload.vue'
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
/**
 * Stores the given URL on a DAO contract.
 * @param url The URL to store on the DAO contract.
 * @returns A Promise that resolves when the URL has been stored on the DAO contract.
 */
const storeOnDAOContract = (url: string): Promise<any> => {
    //TODO: Implementation details for storing the URL on a DAO contract go here @skyline9981
    return Promise.resolve()
}

/**
 * Uploads the given text content to IPFS and stores the resulting URL on a smart contract using the specified function.
 * @param text The text content to upload.
 * @param storeOnContractFunc The function to use for storing the URL on a smart contract.
 */
const handlePublish = (
    text: string,
    files?: File[],
    afterUploadHook?: (url: string) => Promise<any>
) => {
    // Upload the text content to IPFS, and get the resulting URL
    uploadToIPFS(text, files)
        .then((url: string) => {
            // Log the uploaded URL to the console
            toast.add({
                severity: 'info',
                summary: 'Success',
                detail: `File uploaded: ${url} (url)`,
                life: 5000
            })
            if (afterUploadHook) {
                afterUploadHook(url).catch((error: Error) => {
                    // Handle any errors that occur when storing the URL on a smart contract
                    console.error('Error storing file on chain:', error)
                    toast.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Error storing file on chain: ${error}`,
                        life: 5000
                    })
                })
            }
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
}
</script>

<template>
    <MdEditor v-model="text"></MdEditor>
    <FileUpload v-model="files"></FileUpload>
    <div class="flex justify-content-center py-6 gap-6">
        <Button
            text
            class="btn shadow-3 text-black-alpha-90 bg-yellow-300 text-l hover:bg-yellow-900 hover:text-yellow-300"
            @click="handlePublish(text, files, storeOnDAOContract)"
            >Publish
        </Button>
        <Button
            text
            class="btn shadow-3 text-black-alpha-90 hover:surface-700 text-l surface-500 hover:text-50"
            @click="router.push('/')"
            >Cancel
        </Button>
    </div>
</template>
<style scoped></style>
