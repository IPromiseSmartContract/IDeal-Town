<template>
    <div class="card mt-5">
        <Toast />
        <FileUpload name="demo[]" accept="" :maxFileSize="1000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button
                            @click="chooseCallback()"
                            icon="pi pi-cloud-upload"
                            rounded
                            outlined
                        ></Button>

                        <Button
                            @click="clearCallback()"
                            icon="pi pi-times"
                            rounded
                            outlined
                            severity="danger"
                            :disabled="!files || files.length === 0"
                        ></Button>
                    </div>
                    <ProgressBar
                        :value="totalSizePercent"
                        :showValue="false"
                        :class="[
                            'md:w-20rem h-1rem w-full md:ml-auto',
                            { 'exceeded-progress-bar': totalSizePercent > 100 }
                        ]"
                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                    >
                </div>
            </template>
            <template #content="{ files, removeFileCallback }">
                <div v-if="files.length > 0">
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div
                            v-for="(file, index) of files"
                            :key="file.name + file.type + file.size"
                            class="card w-full m-0 pl-4 flex flex-row border-1 surface-border gap-3 justify-content-between"
                        >
                            <div class="flex gap-4 align-items-center">
                                <span class="font-semibold">{{ file.name }}</span>
                                {{ formatSize(file.size) }}
                            </div>
                            <div class="flex gap-4 align-items-center">
                                <Badge value="Pending" severity="warning" />
                                <Button
                                    icon="pi pi-times"
                                    text
                                    @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                    severity="danger"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                    <i
                        class="pi pi-cloud-upload border-2 border-circle p-3 text-3xl text-400 border-400"
                    />
                    <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import ProgressBar from 'primevue/progressbar'

const totalSize = ref(0)
const totalSizePercent = ref(0)

const props = defineProps({
    modelValue: {
        type: Array<File>,
        default: []
    }
})
const emit = defineEmits(['update:modelValue'])
const files = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const onSelectedFiles = (event: FileUploadSelectEvent) => {
    files.value = event.files
    files.value.forEach(async (file: File) => {
        totalSize.value += parseInt(formatSize(file.size))
    })
}
const onRemoveTemplatingFile = (file: any, removeFileCallback: Function, index: number) => {
    removeFileCallback(index)
    totalSize.value -= parseInt(formatSize(file.size))
    totalSizePercent.value = totalSize.value / 10
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
<style scoped>
::v-deep(.p-fileupload .p-fileupload-buttonbar) {
    background-color: inherit;
}
::v-deep(.p-fileupload .p-fileupload-content) {
    background-color: inherit;
}
</style>
