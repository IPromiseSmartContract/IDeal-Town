<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import SpeedDial from 'primevue/speeddial'

import { computed, reactive, ref, onMounted } from 'vue'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { getStatusStyle } from '@/utils/style'

import { useWalletStore } from '@/stores/wallet'
import { ProjectFactory__factory } from "@/contracts"
import type { ProjectCreatedEvent } from "@/contracts/ProjectFactory"
import type { ProjectFactory } from '@/contracts'
import Skeleton from 'primevue/skeleton';

const toast = useToast()
const router = useRouter()
const walletStore = useWalletStore()
const factoryAddress = import.meta.env.VITE_PROJECT_FACTORY_ADDRESS;
let factory:ProjectFactory; 

interface IProject {
    id: string
    name: string
    status: string
    address: string
}
const isLoading = ref(true)
const projects = reactive<IProject[]>([])
const getProjects = async () => {
    if(!walletStore.isConnected){
        await walletStore.connect()
    }
    factory = ProjectFactory__factory.connect(factoryAddress, walletStore.provider!)
    const events: ProjectCreatedEvent[] = await factory.queryFilter(factory.filters.ProjectCreated())
    isLoading.value = false;
    const statusList = ['completed', 'active', 'inactive']

    for (const event of events) {
        const project: IProject = {
            id: event.args.projectId.toString(),
            name: event.args.projectName,
            status: "active",
            address: event.args.projectAddress
        }
        projects.push(project)
    }
    projects.sort((a, b) => b.id.localeCompare(a.id));
}
onMounted(async () => {
    await getProjects()
})
const activeProjects = computed(() => {
    // Filter projects by status
    return projects.filter((project) => project.status !== 'ina1ctive')
})

const goToProjectView = (project: IProject) => {
    router.push(`/project/${project.address}`)
}

const items = ref([
    {
        label: 'Add',
        icon: 'pi pi-pencil',
        command: () => {
            toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added', life: 5000 })
            router.push(`/create-project`)
        }
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
            toast.add({
                severity: 'success',
                summary: 'Update',
                detail: 'Data Updated',
                life: 5000
            })
        }
    }
])
</script>

<template>
    <main>
        <div class="card" v-if="isLoading">
            <div class="flex flex-wrap justify-content-center card-container gap-6">
                <Skeleton 
                    class="h-28rem flex border-round justify-content-center w-full lg:w-3 md:w-5 sm:w-full shadow-2 hover:shadow-8"
                    v-for="index in 12"
                    :key="`Skeleton-${index}`">
                </Skeleton>
            </div>
        </div>
        <div class="card" v-else>
            <div class="flex flex-wrap justify-content-center card-container gap-6">
                <Card
                    class="flex border-round justify-content-center w-full lg:w-3 md:w-5 sm:w-full shadow-2 hover:shadow-8"
                    v-for="project in activeProjects"
                    :key="project.id"
                    style="background-color: inherit"
                >
                    <template #header> </template>
                    <template #title> {{ project.name }} </template>
                    <template #subtitle>
                        <Tag :style="getStatusStyle(project.status)">{{ project.status }} </Tag>
                    </template>
                    <template #content>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                            consequuntur error repudiandae numquam deserunt quisquam repellat libero
                            asperiores earum nam nobis, culpa ratione quam perferendis esse,
                            cupiditate neque quas!
                        </p>
                    </template>
                    <template #footer>
                        <div class="flex justify-content-center card-container gap-4">
                            <Button
                                icon="pi pi-check"
                                label="Join"
                                style="background-color: #eebc63; border: 0; color: #000"
                                @click="(e:Event)=>goToProjectView(project)"
                            />
                            <Button
                                icon="pi pi-times"
                                label="More"
                                style="background-color: rgba(70, 58, 58, 0.8)"
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </main>
    <div
        :style="{
            position: 'sticky',
            bottom: '20vh',
            height: '10px',
            left: '20px'
        }"
    >
        <SpeedDial :model="items" direction="up" class="z-5" buttonClass="p-button-warning" />
    </div>
</template>
<style scoped></style>
