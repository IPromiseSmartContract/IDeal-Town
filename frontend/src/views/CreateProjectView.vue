<script setup lang="ts">
import { ref } from 'vue'
import MdEditor from '@/components/MdEditor.vue'
import Button from 'primevue/button'
import { uploadToIPFS, storeOnContract } from '@/utils/ipfs'
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
 * Stores the given URL on a DAO contract.
 * @param url The URL to store on the DAO contract.
 * @returns A Promise that resolves when the URL has been stored on the DAO contract.
 */
const storeOnContract = (url: string): Promise<any> => {
  // TODO: Implementation details for storing the URL on a DAO contract go here
}

/**
 * Uploads the given text content to IPFS and stores the resulting URL on a smart contract using the specified function.
 * @param text The text content to upload.
 * @param storeOnContractFunc The function to use for storing the URL on a smart contract.
 */
const handlePublish = (text: string, afterUploadHook: (url: string) => Promise<any>) => {
  // Upload the text content to IPFS, and get the resulting URL
  uploadToIPFS(text)
    .then((url: string) => {
      // Log the uploaded URL to the console
      console.log(`File uploaded: ${url} (url)`)

      afterUploadHook(url).catch((error: Error) => {
        // Handle any errors that occur when storing the URL on a smart contract
        console.error('Error storing file on chain:', error)
      })
    })
    .catch((error: Error) => {
      // Handle any errors that occur when uploading the text content to IPFS
      console.error('Error uploading file:', error)
    })
}
</script>

<template>
  <MdEditor v-model="text"></MdEditor>
  <Button @click="handlePublish(text)">Publish to IPFS</Button>
</template>
<style scoped></style>
