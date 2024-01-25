<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.variant"
  >
    <p class="text-center">
      {{ snackbar.message }}
    </p>
  </v-snackbar>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
const store = useAppStore()
const snackbar = computed(() => {
  return store.getSnackbar
})
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
