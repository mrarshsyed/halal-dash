<template>
  <div>
    <v-text-field v-model="search" placeholder="Enter search here ..." class="mb-4" />
    <v-data-table
      density="compact"
      :headers="headers"
      :items="filteredItems()"
      item-value="_id"
    >
      <template #item.name="{ item }">
        {{ item?.country?.name }}
      </template>
      <template #item.region="{ item }">
        {{ item?.region?.name }}
        <v-chip v-if="item?.region?.holidayIndex > 0" size="x-small" class="ml-1">{{ item?.region?.holidayIndex }}</v-chip>
      </template>
      <template #item.subRegion="{ item }">
        {{ item?.subRegion?.name }}
        <v-chip v-if="item?.subRegion?.holidayIndex > 0" size="x-small" class="ml-1">{{ item?.subRegion?.holidayIndex }}</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const search = ref('')
const items = ref([])

const filteredItems = () => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter((item) =>
    item?.country?.name?.toLowerCase().includes(q) ||
    item?.region?.name?.toLowerCase().includes(q) ||
    item?.subRegion?.name?.toLowerCase().includes(q)
  )
}

const headers = [
  { title: 'Country', key: 'name', align: 'start' },
  { title: 'Region', key: 'region', align: 'start' },
  { title: 'Sub Region', key: 'subRegion', align: 'start' }
]

const loadItems = async () => {
  await axios.get('admin/misc/countries').then((res) => {
    if (res?.data?.length) {
      items.value = res?.data
    }
  })
}

onMounted(async () => {
  await loadItems()
})
</script>
