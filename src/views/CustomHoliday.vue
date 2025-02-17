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
          <v-col
            cols="12"
            md="6"
          >
            <p class="text-h6 font-weight-bold">
              User Details
            </p>
            <p class="font-weight-bold">
              User Name
            </p>
            <p class="mb-2">
              {{ orderDetails?.user?.name }}
            </p>
            <p class="font-weight-bold">
              User Email
            </p>
            <p class="mb-2">
              {{ orderDetails?.user?.email }}
            </p>
            <p class="font-weight-bold">
              User Phone
            </p>
            <p>{{ orderDetails?.user?.contactNumber }}</p>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <p class="font-weight-bold">
              Booking Date
            </p>
            <p>{{ formateDate(orderDetails?.createdAt) }}</p>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <p class="font-weight-bold">
              HEx Booking ID
            </p>
            <p>{{ orderDetails?.bookingId }}</p>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <p class="font-weight-bold">
              Total
            </p>
            <p>{{ orderDetails?.amount }}</p>
          </v-col>
          <v-col
            cols="12"
          >
            <v-card>
              <v-card-title>
                Hotel
              </v-card-title>
              <v-card-text>
                <div
                  class="mb-4"
                  v-for="(item,index) in hotelBookings"
                  :key="index"
                >
                  <Hotel
                    v-if="item"
                    :order-details="item"
                  />
                  <hr class="mt-2">
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
          >
            <v-card>
              <v-card-title>
                Activity  
              </v-card-title>
              <v-card-text>
                <div
                  class="mb-4"
                  v-for="(item,index) in activityBookings"
                  :key="index"
                >
                  <Activity :order-details="item" />
                  <hr class="mt-2">
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
          >
            <v-card title="Transfer">
              <v-card-text>
                <div
                  class="mb-4"
                  v-for="(item,index) in transferBookings"
                  :key="index"
                >
                  <Transfer :order-details="item" />
                  <hr class="mt-2">
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
          >
            <v-card title="Insurance">
              <v-card-text>
                <div
                  class="mb-4"
                  v-for="(item,index) in insuranceBookings"
                  :key="index"
                >
                  <Insurance :order-details="item" />
                  <hr class="mt-2">
                </div>
              </v-card-text>
            </v-card>
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
      height="800px"
      fixed-header
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
import { ref ,computed} from 'vue'
import axiosInstance from '@/plugins/axios'
import { formateDate } from '@/utils/date'
import Hotel from '@/components/Order/Hotel.vue'
import Activity from '@/components/Order/Activity.vue'
import Transfer from '@/components/Order/Transfer.vue'
import Insurance from '@/components/Order/Insurance.vue'


const orderDetails = ref(null)

const onDetails = (data) => {
  orderDetails.value = data
}

const hotelBookings = computed(() => {
  return orderDetails.value?.hotelBookings
})
const activityBookings = computed(() => {
  return orderDetails.value?.activityBookings
})
const transferBookings = computed(() => {
  return orderDetails.value?.transferBookings
})
const insuranceBookings = computed(() => {
  return orderDetails.value?.insuranceBookings
})

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
