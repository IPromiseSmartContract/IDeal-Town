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
  <Menubar :model="items" class="gap-4 navbar"
    style="background-color: inherit; padding: 20px 10px 20px 10px; font-family: 'Allerta Stencil'">
    <template #start>
      <LogoSvg :width="40" :height="40" alt="logo" />
    </template>
    <template #end>
      <Button style="
          background-color: black;
          border: 0;
          font-weight: 700;
          color: #eebc63;
          font-family: 'Allerta Stencil';
        ">Connect Wallet</Button>
    </template>
  </Menubar>
</template>
<style scoped>
:deep(.p-menubar-end) {
  margin-left: 2px;
}

.navbar {
  border: 0px;
  border-radius: 0px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
}

:deep(.p-menubar-root-list) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
