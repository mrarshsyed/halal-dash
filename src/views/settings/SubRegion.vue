<template>
  <div>
    <p>Sub Region</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from '@/plugins/axios'

const loadItems = async () => {
  await axios.get('admin/misc/country-sub-regions')
}

onMounted(async () => {
  await loadItems()
})
</script>
