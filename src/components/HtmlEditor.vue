<template>
  <div>
    <p class="mb-4">
      {{ componentData?.label?? 'Html Content' }}
    </p>
    <QuillEditor
      theme="snow"
      toolbar="minimal"
      v-bind="$attrs"
      clearable
      :content="content"
      content-type="html"
      ref="quillEditor"
      @update:content="updateContent"
    />
  </div>
</template>

<script setup>

import { useAppStore } from '@/store/app';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref,computed } from 'vue';
const store =  useAppStore();


const quillEditor = ref();

const updateContent = (data)=>{
  store.updateField('description', data)
}


const componentData = computed(() => {
  return  store?.dialog.formComponents?.fields?.find((x)=> x?.type === 'html-editor')
})

const content = computed(() => {
  return componentData.value.value
})

</script>


<style lang="scss" scoped></style>
