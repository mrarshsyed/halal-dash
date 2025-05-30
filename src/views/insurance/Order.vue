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
              {{ orderDetails?.bookingPayload?.mainContact?.name }}
            </p>
            <p class="font-weight-bold">Contact Email</p>
            <p class="mb-2">
              {{ orderDetails?.bookingPayload?.mainContact?.email }}
            </p>
            <p class="font-weight-bold">Contact Phone</p>
            <p>
              {{ orderDetails?.bookingPayload?.mainContact?.phone }}
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
        </v-row>
        <Insurance :order-details="orderDetails" />
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
      <template #item.id="{ item }">
        {{ item?.bookingId }}
      </template>
      <template #item.package="{ item }">
        {{ item?.insurancePackage?.name }}
      </template>
      <template #item.user_name="{ item }">
        {{ item?.mainContact?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.mainContact?.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.mainContact?.phone }}
      </template>
      <template #item.dates="{ item }">
        <div class="d-block" style="width: max-content">
          <p>
            Start Date:
            {{ formateDate(item?.bookingPayload?.travelingDate?.start) }}
          </p>
          <p>
            End Date:
            {{ formateDate(item?.bookingPayload?.travelingDate?.end) }}
          </p>
        </div>
      </template>
      <template #item.guests="{ item }">
        <div class="d-block" style="width: max-content">
          <p>
            Adults :
            {{ item?.bookingPayload?.travelerInformation?.adults?.count }}
          </p>
          <p>
            Children :
            {{ item?.bookingPayload?.travelerInformation?.children?.count }}
          </p>
          <p>
            Senior:
            {{ item?.bookingPayload?.travelerInformation?.seniors?.count }}
          </p>
        </div>
      </template>
      <template #item.price="{ item }"> AED {{ item?.quotedPrice }} </template>
      <template #item.port="{ item }">
        {{ item?.preferredDeparturePort?.name }}
      </template>
      <template #item.enquiry_on="{ item }">
        {{ formateDate(item?.createdAt) }}
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosInstance from '@/plugins/axios'
import { formateDate } from '@/utils/date'
import Insurance from '@/components/Order/Insurance.vue'

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Action', key: 'action', align: 'start' },
    { title: 'Booking ID', key: 'id', align: 'start' },
    { title: 'Booking Date', key: 'enquiry_on', align: 'start' },
    { title: 'Package', key: 'package', align: 'start' },
    // { title: 'User Name', key: 'user_name', align: 'start' },
    // { title: 'User Email', key: 'user', align: 'start' },
    // { title: 'Contact Number', key: 'contactNumber', align: 'start' },
    { title: 'Dates', key: 'dates', align: 'start' },
    { title: 'Travellers', key: 'guests', align: 'start' },
    { title: 'Price', key: 'price', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ]
})
const orderDetails = ref(null)

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/insurance/bookings`, {
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
const onDetails = (data) => {
  orderDetails.value = data
  console.log(orderDetails.value)
}
</script>
