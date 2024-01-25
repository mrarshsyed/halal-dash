<template>
  <v-dialog
    v-model="dialog.show"
    max-width="600"
    persistent
    scrollable
  >
    <v-card :title="dialog.title">
      <v-card-text>
        {{ dialog.content }}
      </v-card-text>
      <v-card-actions class="pt-4 pr-4">
        <v-spacer />
        <v-btn
          color="error"
          variant="outlined"
          class="px-4"
          @click="dialog.show = false"
        >
          {{ dialog.cancelText }}
        </v-btn>
        <v-btn
          @click="confirm"
          class="px-4"
          color="primary"
          variant="elevated"
        >
          {{ dialog.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
const store = useAppStore()
const dialog = computed(() => {
  return store.dialog
})
const confirm = async () => {
  await dialog.value.confirmFunction()
}
</script>
