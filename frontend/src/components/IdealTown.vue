<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const address = computed(() => route.params.address)
</script>
<template>
  <div>{{ address }}</div>
</template>
