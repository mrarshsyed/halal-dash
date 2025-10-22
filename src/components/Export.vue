<template>
  <form class="flex items-center gap-2" @submit="onExport">
    <input type="date" class="bg-gray-50 p-1.5 border rounded w-36" placeholder="Start" v-model="form.start"
      :min="today" />
    <input type="date" class="bg-gray-50 p-1.5 border rounded w-36" placeholder="End" v-model="form.end"
      :min="form.start || today" />
    <button
      class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!form.start || !form.end">
      Export
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  start: '',
  end: ''
})

const emit = defineEmits(['export'])

const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

const onExport = (e) => {
  e.preventDefault()
  emit('export', { ...form }) // optional: emit with dates
}
</script>
