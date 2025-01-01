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
      <template #item.id="{ item }">
        {{ item?.bookingId }}
      </template>
      <template #item.bookingDate="{ item }">
        {{ formateDate(item?.createdAt) }}
      </template>
      <template #item.package="{ item }">
        {{ item?.package?.name }}
      </template>
      <template #item.user_name="{ item }">
        {{ item?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.contactNumber }}
      </template>
      <template #item.note="{ item }">
        {{ item?.note }}
      </template>
      <template #item.guests="{ item }">
        <div class="d-block" style="width: max-content">
          <p>Adults : {{ item?.guests?.adults }}</p>
          <p>Children : {{ item?.guests?.children?.toString() }}</p>
          <p>Infants : {{ item?.guests?.infants?.toString() }}</p>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'
import { formateDate } from '@/utils/date'

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Booking ID', key: 'id', align: 'start' },
    { title: 'Booking Date', key: 'bookingDate', align: 'start' },
    { title: 'Status', key: 'status', align: 'start' },
    { title: 'Residency', key: 'residency', align: 'start' },
    { title: 'Package', key: 'package', align: 'start' },
    { title: 'User Name', key: 'user_name', align: 'start' },
    { title: 'User Email', key: 'user', align: 'start' },
    { title: 'Contact Number', key: 'contactNumber', align: 'start' },
    { title: 'Preference', key: 'note', align: 'start' },
    { title: 'Guests', key: 'guests', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ]
})
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/holiday/enquiries`, {
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
