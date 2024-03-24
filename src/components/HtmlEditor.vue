<template>
  <div>
    <p class="mb-4">
      {{ componentData?.label?? 'Html Content' }}
    </p>
    
    <DocumentEditor v-model="editorData" />
    
    <!-- <QuillEditor
      theme="snow"
      toolbar="minimal"
      v-bind="$attrs"
      clearable
      :content="content"
      content-type="html"
      ref="quillEditor"
      @update:content="updateContent"
    /> -->
  </div>
</template>

<script setup>

import { useAppStore } from '@/store/app';
import { computed } from 'vue';
import DocumentEditor from './DocumentEditor.vue'
const store =  useAppStore();


const componentData = computed(() => {
  return  store?.dialog.formComponents?.fields?.find((x)=> x?.type === 'html-editor')
})


const editorData = computed({
  get: () => {
    return componentData.value.value
  },
  set: (newValue) => {
    store.updateField('description', newValue)
  }
})






</script>


<style lang="scss" scoped></style>
