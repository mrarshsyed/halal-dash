<template>
  <div>
    <div v-show="orderDetails">
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
              {{ orderDetails?.name }}
            </p>
            <p class="font-weight-bold">Contact Email</p>
            <p class="mb-2">
              {{ orderDetails?.email }}
            </p>
            <p class="font-weight-bold">Contact Phone</p>
            <p>
              {{ orderDetails?.contactNumber }}
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
            <p class="font-weight-bold">Residency</p>
            <p>{{ orderDetails?.residency }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Country</p>
            <p>{{ orderDetails?.country }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Package Name</p>
            <p>{{ orderDetails?.package?.name }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">No of Adults</p>
            <p>{{ orderDetails?.guests?.adults }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">No of Children</p>
            <p>{{ orderDetails?.guests?.children?.length }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">No of Infants</p>
            <p>{{ orderDetails?.guests?.infants?.length }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Preference</p>
            <p>{{ orderDetails?.note }}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <v-data-table-server
      v-show="!orderDetails"
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

const orderDetails = ref(null)
const onDetails = (data) => {
  orderDetails.value = data
}
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
