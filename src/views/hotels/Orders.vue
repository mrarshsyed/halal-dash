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
              {{
                orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                  ?.title
              }}
              {{
                orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                  ?.first_name_original
              }}
              {{
                orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                  ?.last_name_original
              }}
            </p>
            <p class="font-weight-bold">Contact Email</p>
            <p class="mb-2">
              {{
                orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                  ?.email
              }}
            </p>
            <p class="font-weight-bold">Contact Phone</p>
            <p>
              {{
                orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                  ?.phone
              }}
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
              {{
                orderDetails?.emergingOrderBookingFormResponse?.data?.order_id
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Hotel Name</p>
            <p>{{ orderDetails?.hotelId?.name }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">No of Room</p>
            <p>
              {{
                orderDetails?.emergingOrderBookingFormPayload?.guests?.length
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Number of Guests</p>
            <p>
              {{
                getGuestCount(
                  orderDetails?.emergingOrderBookingFinishPayload?.rooms,
                  'adults'
                )
              }}
              Adults,
              {{
                getGuestCount(
                  orderDetails?.emergingOrderBookingFinishPayload?.rooms,
                  'adults'
                )
              }}
              Children
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Lead Guest Name</p>
            {{
              orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                ?.title
            }}
            {{
              orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                ?.first_name_original
            }}
            {{
              orderDetails?.emergingOrderBookingFinishPayload?.supplier_data
                ?.last_name_original
            }}
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Room Type</p>
            <p>
              {{ orderDetails?.rateHash?.room_data_trans?.main_name }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Check-in</p>
            <p>
              {{
                formateDate(
                  orderDetails?.emergingOrderBookingFormPayload?.checkin
                )
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Check-out Date</p>
            <p>
              {{
                formateDate(
                  orderDetails?.emergingOrderBookingFormPayload?.checkout
                )
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Preference</p>
            <p>
              {{ orderDetails?.customData?.note }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Payment Status</p>
            <p>{{ orderDetails?.paymentStatus }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Booking Done</p>
            {{ orderDetails?.emergingBookingDone ? 'Yes' : 'No' }}
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Booking Confirmed</p>
            {{ orderDetails?.emergingBookingConfirmed ? 'Yes' : 'No' }}
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Price</p>
            <p>AED {{ orderDetails?.price }}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <v-data-table-server
      v-else
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
      <template #item.action="{ item }">
        <v-btn
          icon="mdi-eye"
          size="x-small"
          variant="text"
          color="primary"
          @click="onDetails(item)"
        />
      </template>
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
    { title: 'Action', key: 'action', align: 'start' },
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
const orderDetails = ref(null)
const onDetails = (data) => {
  orderDetails.value = data
  console.log(orderDetails.value)
}
const getGuestCount = (data, guestType) => {
  if (!data || !Array.isArray(data)) return 0

  return data.reduce((count, room) => {
    if (!room.guests || !Array.isArray(room.guests)) return count

    return (
      count +
      room.guests.filter((guest) =>
        guestType === 'adults' ? !guest.is_child : guest.is_child
      ).length
    )
  }, 0)
}

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
