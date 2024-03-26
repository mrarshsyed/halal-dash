<template>
  <div>
    <v-file-input
      v-model="uploads"
      :prepend-icon="null"
      prepend-inner-icon="mdi-paperclip"
      label="Images"
      variant="outlined"
      :multiple="true"
      :chips="true"
    />
    <v-row v-if="uploads.length">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(image, index) in uploads"
        :key="index"
        class="pa-4"
      >
        <div style="position: relative">
          <v-img
            :src="getImageUrl(image)"
            height="250"
            class="rounded w-full"
            alt="image"
            cover
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
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'

const props = defineProps({
    value: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update'])

const uploads = ref([...props.value]);

const removeImage = (index) => {
  uploads.value.splice(index, 1)
}

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

watch(() => uploads.value, (newValue, oldValue) => {
    emit('update', uploads.value)
})
</script>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}

/* Add your component-specific styles here */
</style>
