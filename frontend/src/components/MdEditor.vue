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
const toolbars: ToolbarNames[] = [
    'bold',
    'underline',
    'italic',
    '-',
    'strikeThrough',
    'title',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task', // ^2.4.0
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '=',
    'revoke',
    'next',
    'save',
    //   'pageFullscreen',
    //   'fullscreen',
    'preview',
    //   'htmlPreview'
    'catalog'
    //   'github'
]
</script>

<template>
    <MdEditor
        v-model="text"
        language="en-US"
        previewTheme="cyanosis"
        :toolbars="toolbars"
        codeTheme="atom"
        :autoDetectCode="true"
        style="background-color: transparent; border: 2px solid; min-height: 80vh"
    />
</template>
<style scoped></style>
