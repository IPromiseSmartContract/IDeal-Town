<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, reactive } from 'vue'
import Tag from 'primevue/tag'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { getStatusStyle } from '@/utils/style'
import MdView from '@/components/MdView.vue'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'

const { handleSubmit, resetForm } = useForm()
const { value, errorMessage, errors } = useField('value', validateField)
const toast = useToast()

function validateField(value) {
    if (!value) {
        return 'Year is required.'
    }

    return true
}

const onSubmit = handleSubmit((values, actions) => {
    if (values.value && values.value >= 1960 && values.value <= 2050) {
        toast.add({ severity: 'info', summary: 'Form Submitted', detail: values.value, life: 3000 })
        resetForm()
    } else {
        actions.setErrors({ value: 'Enter a valid year.' })
    }
})
const route = useRoute()
const address = computed(() => route.params.address)
const wallet = reactive({
    idt: 120,
    ipj: 200
})
const project = reactive({
    name: 'Project name',
    mdContent: `
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
`,
    address: 'ox2561521',
    status: 'active',
    currentIpj: 1000
})

interface ISolution {
    id: number
    name: string
    link: string
    voteIdc: number
}
const solutions = reactive<ISolution[]>([])
const generateSolutions = async () => {
    for (let i = 1; i <= 20; i++) {
        const project: ISolution = {
            id: i,
            name: `Solution ${i}`,
            link: `https://ipfs.io/ipfs/${Math.floor(Math.random() * 1000000).toString(16)}`,
            voteIdc: 0
        }
        solutions.push(project)
    }
}
onMounted(async () => {
    await generateSolutions()
})
</script>
<template>
    <div class="card mx-4">
        <div class="p-title grid mt-5 p-1 mx-1">
            <div class="col-12 md:col-8 flex gap-3">
                <h4>{{ project.name }}</h4>
                <Tag :style="getStatusStyle(project.status)">{{ project.status }} </Tag>
            </div>
            <div class="col-12 md:col-4 flex justify-content-end"></div>
        </div>
        <div class="p-body grid mt-0 p-2 mx-1">
            <MdView v-model="project.mdContent"></MdView>
        </div>
        <!-- Solution -->
        <div class="p-title grid mt-5 p-2 mx-1 align-items-center justify-content-between">
            <h4>Solution</h4>
            <Button size="small" class="p-btn shadow-3">Solve</Button>
        </div>
        <div class="p-body mt-0 p-2 mx-1 flex flex-column gap-3">
            <div v-for="solution in solutions" :key="solution.id" class="grid">
                <div class="col-8">
                    <Card
                        class="border-round justify-content-center w-full shadow-2 hover:shadow-8"
                        style="background-color: inherit"
                    >
                        <template #header> </template>
                        <template #title> {{ solution.name }} </template>
                        <template #subtitle> </template>
                        <template #content>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
                                sed consequuntur error repudiandae numquam deserunt quisquam
                                repellat libero asperiores earum nam nobis, culpa ratione quam
                                perferendis esse, cupiditate neque quas!
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex justify-content-center card-container gap-4">
                                <Button
                                    icon="pi pi-times"
                                    label="More"
                                    style="background-color: rgba(70, 58, 58, 0.8)"
                                />
                            </div>
                        </template>
                    </Card>
                </div>
                <div class="col-4">
                    <form @submit="onSubmit" class="flex flex-column gap-2">
                        <label for="year">Enter a year between 1960-2050.</label>
                        <InputNumber
                            v-model="solution.voteIdc"
                            :class="{ 'p-invalid': errorMessage }"
                            :useGrouping="false"
                        />
                        <small class="p-error" id="number-error">{{
                            errorMessage || (errors.length > 0 ? errors : '&nbsp;')
                        }}</small>
                        <Button type="submit" label="Submit" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
::v-deep(.p-inputgroup-addon) {
    background-color: rgb(70, 58, 58);
    color: rgb(238, 188, 99);
}
::v-deep(.p-inputnumber-input) {
    background-color: inherit;
}
::v-deep(.p-progressbar-value) {
    background-color: rgb(70, 58, 58) !important;
}
::v-deep(.p-progressbar) {
    background-color: rgb(70, 58, 58, 0.4) !important;
}
::v-deep(.p-progressbar-label) {
    color: rgb(238, 188, 99) !important;
    font-size: small;
}
.p-title {
    border: 2px solid rgb(70, 58, 58);
    color: rgb(59, 48, 48);
    font-size: large;
    font-family: 'Allerta Stencil';
}
.p-body {
    border: 1px solid rgb(70, 58, 58);
    border-top: 0px;
}
.p-btn {
    background-color: rgb(238, 188, 99);
    color: rgb(70, 58, 58);
    border: 0px;
    font-family: 'Allerta Stencil';
}
.p-btn:hover {
    background-color: rgb(70, 58, 58) !important;
    color: rgb(238, 188, 99) !important;
    border: 0px !important;
    font-family: 'Allerta Stencil';
}
.v-sol {
    height: 3rem;
    width: 100%;
    border: 1px solid;
}
</style>
