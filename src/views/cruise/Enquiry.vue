<template>
  <div>
    <v-data-table-server
      class="mt-4"
      density="compact"
      v-model:items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
      @update:options="loadItems"
      :show-current-page="true"
    >
      <template #item.package="{ item }">
        {{ item?.package?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.contactNumber }}
      </template>
      <template #item.sailingDate="{ item }">
        {{ format(new Date(item?.preferredSailingDate), 'dd MMM yyyy') ?? '-' }}
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'
import { format } from 'date-fns'

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Package', key: 'package', align: 'start' },
    { title: 'User', key: 'user', align: 'start' },
    { title: 'Contact Number', key: 'contactNumber', align: 'start' },
    { title: 'Sailing Date', key: 'sailingDate', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ]
})
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/cruise/enquiries`, {
      params: {
        page: page,
        perPage: itemsPerPage
      }
    })
    .then((res) => {
      // store.setUserList(res?.data?.data)
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.total
    })
}
onMounted(async () => {})
</script>
