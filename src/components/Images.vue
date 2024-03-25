<template>
  <div>
    <v-file-input
      v-model="images"
      :prepend-icon="null"
      prepend-inner-icon="mdi-paperclip"
      label="Images"
      variant="outlined"
      :multiple="true"
      :chips="true"
    />
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
            :src="getImageUrl(image)"
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

    <ImageList />
  </div>
</template>

<script setup>
import ImageList from './ImageList.vue';
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
const store = useAppStore()

const componentData = computed(() => {
  return store?.dialog.formComponents?.fields?.find((x) => x?.key === 'uploads')
})

const getImageUrl = (file) => {
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

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const images = computed({
  get: () => {
    return componentData?.value?.value?.length ? componentData?.value.value : []
  },
  set: (newValue) => {
    store.updateField('uploads', newValue)
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
