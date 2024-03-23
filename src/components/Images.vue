<template>
  <div>
    <v-file-input
      v-model="value"
      :prepend-icon="null"
      prepend-inner-icon="mdi-paperclip"
      :label="componentData?.label ?? 'Images'"
      variant="outlined"
      :multiple="componentData?.multiple"
      :chips="componentData?.multiple"
    />
    <v-row
      class="my-4"
      v-if="value?.length"
    >
      <v-col 
        cols="12" 
        sm="6" 
        md="4" 
        v-for="(i, index) in value" 
        :key="index"
      >
        <v-img
          :src="getImageUrl(i)"
          height="250"
          class="rounded shadow border"
          alt="image"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import {  computed } from 'vue'

const store = useAppStore()

const getImageUrl = (file) => {
  console.log(typeof file);
  if (typeof file === "string") {
    return file    
  }
  if (!file) {
    console.error('File object is null or undefined.')
    return null
  }
  try {
    const localURL = URL.createObjectURL(file)
    return localURL
  } catch (error) {
    console.error('Error creating local URL:', error)
    return null
  }
}



const value = computed({
  get: () => {
    return componentData?.value?.value?.length ? componentData?.value.value : []
  },
  set: (newValue) => {
    store.updateField('images', newValue)
  }
})

const componentData = computed(() => {
  return store?.dialog.formComponents?.fields?.find((x) => x?.type === 'images')
})
</script>

<style lang="scss" scoped></style>
