<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import SpeedDial from 'primevue/speeddial'

import { computed, reactive, ref, onMounted } from 'vue'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()
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
const activeProjects = computed(() => {
  // Filter projects by status
  return projects.filter((project) => project.status !== 'ina1ctive')
})

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        backgroundImage: 'linear-gradient(120deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
      }
    case 'active':
      return {
        backgroundImage: 'linear-gradient(120deg, rgba(252,70,107,1) 0%, rgba(63,94,251,1) 100%)'
      }
    case 'inactive':
      return {
        backgroundImage: 'linear-gradient(120deg, rgba(0,0,0,1) 0%, rgba(10,50,100,1) 100%)'
      }
    default:
      return {}
  }
}
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
      toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated', life: 5000 })
    }
  }
])
</script>

<template>
  <main>
    <div class="card">
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
              error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam
              nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
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
      bottom: '15vh',
      height: '10px',
      left: '20px'
    }"
  >
    <SpeedDial :model="items" direction="up" class="z-5" buttonClass="p-button-warning" />
  </div>
</template>
<style scoped></style>
