<template>
  <v-overlay
    persistent
    :model-value="loading"
    class="align-center justify-center"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { computed } from 'vue'

const store = useAppStore()

const loading = computed(() => store.isLoading)
</script>
