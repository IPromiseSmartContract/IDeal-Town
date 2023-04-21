<script setup lang="ts">
import { computed, ref } from 'vue'
import MdEditor, { type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
const props = defineProps({
    modelValue: {
        type: String,
        required: true
    }
})
const emit = defineEmits(['update:modelValue'])
const text = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <MdEditor
        v-model="text"
        language="en-US"
        previewTheme="cyanosis"
        :toolbars="[]"
        codeTheme="atom"
        :previewOnly="true"
        style="background-color: transparent; border: 0px solid"
    />
</template>
<style scoped></style>
