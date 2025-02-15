<template>
  <div>
    <div v-if="orderDetails">
      <v-card-text>
        <v-btn
          class="mb-4"
          size="x-small"
          color="primary"
          icon="mdi-arrow-left"
          @click="orderDetails = null"
        />
        <v-row>
          <v-col cols="12" md="6">
            <p class="text-h6 font-weight-bold">User Details</p>
            <p class="font-weight-bold">User Name</p>
            <p class="mb-2">
              {{ orderDetails?.user?.name }}
            </p>
            <p class="font-weight-bold">User Email</p>
            <p class="mb-2">
              {{ orderDetails?.user?.email }}
            </p>
            <p class="font-weight-bold">User Phone</p>
            <p>{{ orderDetails?.user?.contactNumber }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-h6 font-weight-bold">Contact Details</p>
            <p class="font-weight-bold">Contact Name</p>
            <p class="mb-2">
              {{ orderDetails?.bookingPayload?.holder?.title }}
              {{ orderDetails?.bookingPayload?.holder?.name }}
              {{ orderDetails?.bookingPayload?.holder?.surname }}
            </p>
            <p class="font-weight-bold">Contact Email</p>
            <p class="mb-2">
              {{ orderDetails?.bookingPayload?.holder?.email }}
            </p>
            <p class="font-weight-bold">Contact Phone</p>
            <p>
              {{ orderDetails?.bookingPayload?.holder?.telephones?.[0] }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Booking Date</p>
            <p>{{ formateDate(orderDetails?.createdAt) }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">HEx Booking ID</p>
            <p>{{ orderDetails?.bookingId }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Supplier Booking ID</p>
            <p>
              {{ orderDetails?.hotelbedsBookingResponse?.reference }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Activity Name</p>
            <p>
              {{ orderDetails?.activity?.name }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">No of Guests</p>
            <p>
              {{ orderDetails?.bookingPayload?.activities[0]?.paxes?.length }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Lead Guest Name</p>
            <p>
              {{
                orderDetails?.bookingPayload?.activities[0]?.paxes[0]?.surname
              }}
              {{ orderDetails?.bookingPayload?.activities[0]?.paxes[0]?.name }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Pick Up Place</p>
            <p>{{ orderDetails?.bookingPayload?.customObjects.pickup }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Pick Up Place</p>
            <p>{{ orderDetails?.bookingPayload?.customObjects?.dropOff }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Preference</p>
            <p>{{ orderDetails?.bookingPayload?.customObjects?.note }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Status</p>
            <p>{{ orderDetails?.status }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Total Amount</p>
            <p>AED {{ orderDetails?.price }}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <v-data-table-server
      v-else
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
      <template #item.action="{ item }">
        <v-btn
          icon="mdi-eye"
          size="x-small"
          variant="text"
          color="primary"
          @click="onDetails(item)"
        />
      </template>
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
    { title: 'Action', key: 'action', align: 'start' },
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
const orderDetails = ref(null)
const onDetails = (data) => {
  orderDetails.value = data
}
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
