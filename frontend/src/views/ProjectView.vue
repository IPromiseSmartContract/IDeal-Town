<script setup lang="ts">
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { computed } from 'vue'
import Card from 'primevue/card'
import Timeline from 'primevue/timeline'
import { ref } from 'vue'

const events = ref([
  {
    status: 'Ordered',
    date: '15/10/2020 10:30',
    icon: 'pi pi-shopping-cart',
    color: '#9C27B0',
    image: 'game-controller.jpg'
  },
  { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
  { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
])

const route = useRoute()
const address = computed(() => route.params.address)
</script>
<template>
  <div class="grid">
    <div class="col-8">
      <Card style="background-color: inherit">
        <template #header> </template>
        <template #title> {{ address }} </template>
        <template #subtitle> Card subtitle </template>
        <template #content>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </template>
        <template #footer> </template
      ></Card>
    </div>
    <div class="col">
      <Timeline :value="events">
        <template #marker="slotProps">
          <span
            class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
            :style="{ backgroundColor: slotProps.item.color }"
          >
            <i :class="slotProps.item.icon"></i>
          </span>
        </template>
        <template #opposite="slotProps">
          <small class="p-text-secondary">{{ slotProps.item.date }}</small>
        </template>
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
      </Timeline>
    </div>
  </div>
</template>
