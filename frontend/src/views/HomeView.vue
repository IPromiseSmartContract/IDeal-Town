<script setup lang="ts">
import Button from 'primevue/button'

import { reactive, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import LoginBtn from '@/components/LoginBtn.vue'
import type { LoginOptActions, LoginOptState } from '@/utils/types'
const dialog = inject<LoginOptActions & LoginOptState>('dialog')!

const router = useRouter()

interface IProject {
    id: number
    name: string
    status: string
    address: string
}
const projects = reactive<IProject[]>([])
const generateProjects = async () => {
    const statusList = ['completed', 'active', 'inactive']
    for (let i = 1; i <= 20; i++) {
        const project: IProject = {
            id: i,
            name: `Project ${i}`,
            status: statusList[Math.floor(Math.random() * statusList.length)],
            address: `0x${Math.floor(Math.random() * 1000000).toString(16)}`
        }
        projects.push(project)
    }
}

onMounted(async () => {
    await generateProjects()
})
const goToProjectListView = () => {
    router.push(`/project`)
}
</script>

<template>
    <div class="section">
        <div
            class="flex justify-content-center card-container pt-5 text-5xl font-bold scalein animation-duration-1000"
        >
            Deal it, and own it.
        </div>
        <div
            class="flex justify-content-center card-container py-5 text-xl scalein animation-duration-1000"
        >
            Ideal town make idea come true
        </div>
        <div class="flex justify-content-center card-container gap-4 mt-6">
            <Button
                icon="pi pi-check"
                label="Join"
                style="background-color: #eebc63; border: 0; color: #000"
                @click="(e: Event) => goToProjectListView()"
            />
            <Button
                icon="pi pi-times"
                label="More"
                style="background-color: rgba(70, 58, 58, 0.8)"
            />
            <LoginBtn></LoginBtn>
        </div>
    </div>
    <div
        class="flex justify-content-center card-container py-5 text-xl scalein animation-duration-1000"
    >
        Ideal town makes idea come true
    </div>
    <div class="flex justify-content-center card-container gap-4 mt-6">
        <Button
            icon="pi pi-check"
            label="Join"
            style="background-color: #eebc63; border: 0; color: #000"
            @click="(e: Event) => goToProjectListView()"
        />
        <Button icon="pi pi-times" label="More" style="background-color: rgba(70, 58, 58, 0.8)" />
        <LoginBtn></LoginBtn>
    </div>
</template>
<style scoped>
.section {
    font-family: 'Allerta Stencil';
    margin-top: 50px;
    margin-bottom: 500px;
}
</style>
