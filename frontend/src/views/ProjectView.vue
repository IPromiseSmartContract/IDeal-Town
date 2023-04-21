<script setup lang="ts">
import Button from 'primevue/button'
import Steps from 'primevue/steps'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { MenuItem } from 'primevue/menuitem'
import ProjectClosed from '@/components/Steps/ProjectClosed.vue'
import ProjectOpen from '@/components/Steps/ProjectOpen.vue'
import ProjectVote from '@/components/Steps/ProjectVote.vue'
import ProjectReview from '@/components/Steps/ProjectReview.vue'
import ProjectReward from '@/components/Steps/ProjectReward.vue'

const currentStep = ref(0)
const tabs = [ProjectOpen, ProjectVote, ProjectReview, ProjectReward, ProjectClosed]
const items = ref<MenuItem[]>([
    {
        key: '0',
        label: 'Open'
    },
    {
        key: '1',
        label: 'Vote'
    },
    {
        key: '2',
        label: 'Review'
    },
    {
        key: '3',
        label: 'Reward'
    },
    {
        key: '4',
        label: 'Closed'
    }
])
const changeStep = (stepKey: string | undefined) => {
    if (!stepKey) {
        console.error(`step key not exist: ${stepKey}`)
    } else {
        currentStep.value = parseInt(stepKey)
    }
}
</script>
<template>
    <div class="card m-4">
        <Steps :readonly="false" :model="items" aria-label="Form Steps">
            <template #item="slotProps">
                <Button class="step-btn" size="small" @click="changeStep(slotProps.item.key)">{{
                    slotProps.item.label
                }}</Button>
            </template>
        </Steps>
    </div>

    <keep-alive>
        <component :is="tabs[currentStep]" />
    </keep-alive>
</template>

<style scoped>
::v-deep(.p-steps .p-steps-item) {
    background-color: inherit;
}
::v-deep(.p-steps .p-button) {
    margin-top: -30px;
}
.step-btn {
    background-color: rgb(238, 188, 99);
    color: rgb(70, 58, 58);
    border: 0px;
    font-family: 'Allerta Stencil';
}
.step-btn:hover {
    background-color: rgb(70, 58, 58) !important;
    color: rgb(238, 188, 99) !important;
    border: 0px !important;
    font-family: 'Allerta Stencil';
}
</style>
