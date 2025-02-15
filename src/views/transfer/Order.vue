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
              {{ orderDetails?.bookingPayload?.holder?.phone }}
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <p class="font-weight-bold">Booking Date</p>
            <p>{{ formateDate(orderDetails?.createdAt) }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">HEx Booking ID</p>
            <p>
              {{ orderDetails?.bookingInfo?.bookings?.[0]?.clientReference }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Supplier Booking ID</p>
            <p>{{ orderDetails?.bookingInfo?.bookings?.[0]?.reference }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Transfer Type</p>
            <p>{{ orderDetails?.service?.transferType }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Pick Up Place</p>
            <p>{{ orderDetails?.search?.from?.description }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Drop Off Place</p>
            <p>{{ orderDetails?.search?.to?.description }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Filght Code</p>
            <p>
              {{
                orderDetails?.bookingPayload?.transfers?.[0]
                  ?.transferDetails?.[0]?.code
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Filght Time</p>
            <p>
              Direction :
              {{
                orderDetails?.bookingPayload?.transfers?.[0]
                  ?.transferDetails?.[0]?.direction
              }}
            </p>
            <p>
              Time :
              {{
                orderDetails?.bookingPayload?.transfers?.[0]
                  ?.transferDetails?.[0]?.time
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Preferences</p>
            <p>{{ orderDetails?.bookingPayload?.remark }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Status</p>
            <p>{{ orderDetails?.status }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Total Amount</p>
            <p>EUR {{ orderDetails?.price }}</p>
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
      <template #item.id="{ item }">
        {{ item?.bookingInfo?.bookings?.[0]?.clientReference }}
      </template>
      <template #item.user_name="{ item }">
        {{ item?.user?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.user.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.user?.contactNumber }}
      </template>
      <template #item.from="{ item }">
        {{ item?.search?.from?.description }}
      </template>
      <template #item.to="{ item }">
        {{ item?.search?.to?.description }}
      </template>

      <template #item.guests="{ item }">
        <div class="d-block" style="width: max-content">
          <p>Adults : {{ item?.search?.occupancy?.adults }}</p>
          <p>Children : {{ item?.search?.occupancy?.children }}</p>
        </div>
      </template>
      <template #item.price="{ item }">
        {{ item?.service?.price?.currencyId }}
        {{ item?.service?.price?.clientAmount }}
      </template>

      <template #item.enquiry_on="{ item }">
        {{ formateDate(item?.createdAt) }}
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'
import { format } from 'date-fns'
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
    { title: 'Booking ID', key: 'id', align: 'start' },
    { title: 'Booking Date', key: 'enquiry_on', align: 'start' },
    { title: 'Reference', key: 'clientReference', align: 'start' },
    { title: 'User Name', key: 'user_name', align: 'start' },
    { title: 'User Email', key: 'user', align: 'start' },
    { title: 'Contact Number', key: 'contactNumber', align: 'start' },
    { title: 'Status', key: 'status', align: 'start' },
    { title: 'From', key: 'from', align: 'start' },
    { title: 'To', key: 'to', align: 'start' },
    { title: 'Travellers', key: 'guests', align: 'start' },
    { title: 'Price', key: 'price', align: 'start' }
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
    .get(`admin/transfer/bookings`, {
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
