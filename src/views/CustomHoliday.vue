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
      height="800px"
      fixed-header
    >
      <template #item.id="{ item }">
        {{ item?.bookingId }}
      </template>
      <template #item.bookingDate="{ item }">
        {{ formateDate(item?.createdAt) }}
      </template>
      <template #item.user="{ item }">
        <div class="d-flex flex-column ga-4">
          <p>
            <span class="font-weight-bold">Email :</span>
            {{ item?.user?.email }}
          </p>
          <p>
            <span class="font-weight-bold">Contact Number :</span> :
            {{ item?.user?.contactNumber }}
          </p>
        </div>
      </template>
      <template #item.hotel="{ item }">
        <div
          v-if="item?.hotelBookings?.length"
          class="nowrap d-flex flex-column ga-4"
        >
          <p>
            <span class="font-weight-bold">Hotel Name : </span>
            {{ item?.hotelBookings[0]?.hotelId?.name }}
          </p>
          <p>
            <span class="font-weight-bold">Room Name : </span>
            {{ item?.hotelBookings[0]?.rateHash?.room_name }}
          </p>
          <p>
            <span class="font-weight-bold">Booking id : </span>
            {{ item?.hotelBookings[0]?.bookingId }}
          </p>
          <p>
            <span class="font-weight-bold">Payment Status : </span>
            {{ item?.hotelBookings[0]?.paymentStatus }}
          </p>
          <p>
            <span class="font-weight-bold">Price : </span>
            AED {{ item?.hotelBookings[0]?.price }}
          </p>
        </div>
      </template>
      <template #item.activities="{ item }">
        <div v-if="item?.activityBookings?.length">
          <div
            v-for="(ac, index) in item?.activityBookings"
            :key="index"
            class="d-flex flex-column ga-4 nowrap"
          >
            <p>
              <span class="font-weight-bold">Activity Name : </span>
              {{ ac?.activity?.name }}
            </p>
            <p>
              <span class="font-weight-bold">Booking id : </span>
              {{ ac?.bookingId }}
            </p>
            <p>
              <span class="font-weight-bold">Payment Status : </span>
              {{ ac?.status }}
            </p>
            <p>
              <span class="font-weight-bold">Price : </span>
              AED {{ ac?.price }}
            </p>
          </div>
        </div>
      </template>
      <template #item.transfers="{ item }">
        <div v-if="item?.transferBookings?.length">
          <div
            v-for="(tf, indexTf) in item?.transferBookings"
            :key="indexTf"
            class="d-flex flex-column ga-4 mb-4 nowrap"
          >
            <p>
              <span class="font-weight-bold">From: </span>
              {{ tf?.service?.pickupInformation?.from?.description }}
            </p>
            <p>
              <span class="font-weight-bold">To: </span>
              {{ tf?.service?.pickupInformation?.to?.description }}
            </p>
            <p>
              <span class="font-weight-bold">Payment Status : </span>
              {{ tf?.paymentStatus }}
            </p>
            <p>
              <span class="font-weight-bold">Price : </span>
              EURO {{ tf?.price }}
            </p>
          </div>
        </div>
      </template>
      <template #item.insurance="{ item }">
        <div v-if="item?.insuranceBookings?.length">
          <div
            v-for="(i, indexI) in item?.insuranceBookings"
            :key="indexI"
            class="d-flex flex-column ga-4 mb-4 nowrap"
          >
            <p>
              <span class="font-weight-bold">ID: </span>
              {{ i }}
            </p>
          </div>
        </div>
      </template>
      <template #item.total="{ item }">
        <p>Total : {{ item?.amount?.toFixed(2) }}</p>
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
    { title: 'Booking ID', key: 'id', align: 'start' },
    { title: 'Booking Date', key: 'bookingDate', align: 'start' },
    { title: 'Hotel', key: 'hotel', align: 'start' },
    { title: 'Activities', key: 'activities', align: 'start' },
    { title: 'Transfers', key: 'transfers', align: 'start' },
    { title: 'Insurance', key: 'insurance', align: 'start' },
    { title: 'User', key: 'user', align: 'start' },
    { title: 'Total', key: 'total', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ]
})

const loadItems = async ({ page, itemsPerPage }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/full-holiday-package/booking`, {
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

<style scoped>
.nowrap {
  white-space: nowrap !important;
}
</style>
