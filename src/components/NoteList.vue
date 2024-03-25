<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <div class="d-flex flex-wrap justify-space-between">
            <h4>Notes</h4>
            <v-btn
              color="primary"
              @click="addNote"
            >
              + Add New Note
            </v-btn>
          </div>
        </v-col>
        <v-col
          cols="12"
          v-for="(note, index) in notes"
          :key="index"
        >
          <div class="text-right mb-1">
            <v-btn
              @click="removeImage(index)"
              icon="mdi-delete"
              class="imageDelete"
              color="error"
              size="x-small"
            />
          </div>
          <v-textarea
            density="compact"
            variant="outlined"
            v-model="notes[index]"
            :placeholder="`Enter Note ${index + 1}`"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
const store = useAppStore()

const componentData = computed(() => {
  return store?.dialog.formComponents?.fields?.find(
    (x) => x?.key === 'note-list'
  )
})

const removeImage = (index) => {
  notes.value.splice(index, 1)
}

const notes = computed({
  get: () => {
    return componentData?.value?.value?.length ? componentData?.value.value : []
  },
  set: (newValue) => {
    store.updateField('note-list', newValue)
  }
})

const addNote = () => {
  notes.value.unshift('')
  store.updateField('note-list', notes.value)
}
</script>

<style scoped>

</style>
