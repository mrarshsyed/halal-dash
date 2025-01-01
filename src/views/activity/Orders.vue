<template>
  <div>
    <!-- <FormComponent /> -->
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
      <template #item.activity_name="{ item }">
        {{ item?.activity?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.user?.email }}
      </template>
      <template #item.status="{ item }">
        {{ item?.status }}
      </template>
      <template #item.bookingId="{ item }">
        {{ item?.bookingId }}
      </template>
      <template #item.bookedOn="{ item }">
        {{ formateDate(item?.bookedOn) }}
      </template>
      <template #item.amount="{ item }">
        AED {{ item?.hotelbedsBookingResponse?.totalNet }}
      </template>
      <template #item.pickup="{ item }">
        {{ item?.bookingPayload?.customObjects?.pickup }}
      </template>
      <template #item.dropOff="{ item }">
        {{ item?.bookingPayload?.customObjects?.dropOff }}
      </template>
      <template #item.preference="{ item }">
        {{ item?.bookingPayload?.customObjects?.note }}
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
    { title: 'Booking Id', key: 'bookingId', align: 'start' },
    { title: 'Booking Date', key: 'bookedOn', align: 'start' },
    { title: 'Activity Name', key: 'activity_name', align: 'start' },
    { title: 'User', key: 'user', align: 'start' },
    { title: 'Status', key: 'status', align: 'start' },
    { title: 'Amount', key: 'amount', align: 'start' },
    { title: 'Pick Up', key: 'pickup', align: 'start' },
    { title: 'Drop Off', key: 'dropOff', align: 'start' },
    {
      title: 'Preference',
      key: 'preference',
      align: 'start'
    }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ]
})

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/activity-bookings`, {
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
</script>

<style lang="scss" scoped></style>
