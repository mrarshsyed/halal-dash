<template>
  <v-row v-if="images?.length">
    <v-col
      cols="12"
      sm="6"
      md="4"
      v-for="(image, index) in images"
      :key="index"
      class="pa-4"
    >
      <div style="position: relative">
        <v-img
          :src="image"
          height="250"
          class="rounded"
          alt="image"          
        />
        <v-btn
          @click="removeImage(index)"
          icon="mdi-delete"
          class="imageDelete"
          color="error"
          size="x-small"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { useAppStore } from '@/store/app';
import {   computed} from 'vue'
const store =  useAppStore ()

const componentData = computed(() => {
  return store?.dialog.formComponents?.fields?.find((x) => x?.key === 'image-list')
})

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const images = computed({
  get: () => {
    return componentData?.value?.value?.length ? componentData?.value.value : []
  },
  set: (newValue) => {
    store.updateField('image-list', newValue)
  }
})

</script>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
