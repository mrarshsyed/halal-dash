<template>
  <div>
    <!-- <FormComponent /> -->
    <v-data-table-server
      class="mt-4"
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
      <template #item.bookingDate="{ item }">
        <p>
          {{ formateDate(item?.createdAt) }}
        </p>
      </template>
      <template #item.hotel_name="{ item }">
        {{ item?.hotelId?.name }}
      </template>
      <template #item.status="{ item }">
        {{ item?.currentEmergingStatus }}
      </template>
      <template #item.room_name="{ item }">
        {{ item?.rateHash?.room_name }}
      </template>
      <template #item.emergingBookingDone="{ item }">
        <v-chip :color="item?.emergingBookingDone ? 'success' : 'error'">
          {{ item?.emergingBookingDone ? 'YES' : 'NO' }}
        </v-chip>
      </template>
      <template #item.emergingBookingConfirmed="{ item }">
        <v-chip :color="item?.emergingBookingConfirmed ? 'success' : 'error'">
          {{ item?.emergingBookingConfirmed ? 'YES' : 'NO' }}
        </v-chip>
      </template>
      <template #item.supplier_info="{ item }">
        <p>
          {{ item?.emergingOrderBookingFinishPayload?.supplier_data?.email }}
        </p>
        <p>
          {{ item?.emergingOrderBookingFinishPayload?.supplier_data?.phone }}
        </p>
      </template>
      <template #item.checkin="{ item }">
        <p>
          {{ formateDate(item?.emergingOrderBookingFormPayload?.checkin) }} to
          {{ formateDate(item?.emergingOrderBookingFormPayload?.checkout) }}
        </p>
      </template>
      <template #item.preference="{ item }">
        {{ item?.customObjects?.note }}
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userFormStore } from '@/store/form'
import axiosInstance from '@/plugins/axios'
import { formateDate } from '@/utils/date'

const formStore = userFormStore()

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Booking ID', key: 'bookingId', align: 'start' },
    { title: 'Booking Date', key: 'bookingDate', align: 'start' },
    { title: 'Hotel Name', key: 'hotel_name', align: 'start' },
    { title: 'Room Name', key: 'room_name', align: 'start' },
    { title: 'Status', key: 'status', align: 'start' },
    { title: 'Booking Done', key: 'emergingBookingDone', align: 'start' },
    {
      title: 'Booking Confirmed',
      key: 'emergingBookingConfirmed',
      align: 'start'
    },
    {
      title: 'Supplier Info',
      key: 'supplier_info',
      align: 'start'
    },
    {
      title: 'Checkin - Checkout',
      key: 'checkin',
      align: 'start'
    },
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

const loadItems = async ({ page, itemsPerPage }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/hotel-bookings`, {
      params: {
        page: page,
        perPage: itemsPerPage,
        ...formStore.getFilteredSearchFields()
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
