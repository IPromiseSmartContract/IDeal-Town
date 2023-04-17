<script setup lang="ts">
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import { ref } from 'vue'
import LogoSvg from '@/components/LogoSvg.vue'
const items = ref([
  {
    label: 'Idea',
    icon: 'pi pi-fw pi-pencil'
    // items: []
  },
  {
    label: 'Developer',
    icon: 'pi pi-fw pi-user'
  },
  {
    label: 'Doc',
    icon: 'pi pi-fw pi-file'
  }
])
</script>

<template>
  <header>
    <Menubar :model="items" style="background-color: white; padding: 20px 10px 15px 10px">
      <template #start>
        <LogoSvg :width="40" :height="40" />
      </template>
      <template #end>
        <Button>Connect Wallet</Button>
      </template>
    </Menubar>
  </header>
  <main></main>
</template>
<style scoped>
:deep(.p-menubar .p-menubar-end) {
  margin-left: 2px !important;
}
:deep(.p-menubar) {
  border: 0px solid #dee2e6;
  border-radius: 0px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
}
</style>
