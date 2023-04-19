<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Card from 'primevue/card'
const route = useRoute()
const address = computed(() => route.params.address)
</script>
<template>
  <Card class="mt-5" style="background-color: inherit">
    <template #header> </template>
    <template #title> {{ address }} </template>
    <template #subtitle> Card subtitle </template>
    <template #content>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa
        ratione quam perferendis esse, cupiditate neque quas!
      </p>
    </template>
    <template #footer> </template
  ></Card>
</template>
