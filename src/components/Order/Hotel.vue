<template>
  <v-row v-if="props.orderDetails">
    <v-col v-for="(item, index) in orderFields" :key="index" cols="12" md="6">
      <p class="font-weight-bold">
        {{ item.label }}
      </p>
      <p v-if="item?.isDate">
        {{ getNestedValue(props?.orderDetails, item.key) }}
      </p>
      <p v-else-if="item.isBoolean">
        {{ getNestedValue(props.orderDetails, item.key) ? 'Yes' : 'No' }}
      </p>
      <p v-else>
        {{
          item?.key?.includes('.')
            ? getNestedValue(props.orderDetails, item.key)
            : props.orderDetails?.[item.key]
        }}
      </p>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { formateDate } from '@/utils/date'

const props = defineProps({
  orderDetails: Object
})

// Function to safely access nested object properties
const getNestedValue = (obj, key) => {
  const keyData = key.split('.').reduce((acc, part) => acc && acc[part], obj)
  return keyData
}

// Function to count guests based on type
const getGuestCount = (rooms, guestType) => {
  if (!rooms || !Array.isArray(rooms)) return 0
  return rooms.reduce((count, room) => {
    if (!room.guests || !Array.isArray(room.guests)) return count
    return (
      count +
      room.guests.filter((guest) =>
        guestType === 'adults' ? !guest.is_child : guest.is_child
      ).length
    )
  }, 0)
}

// Define fields with flexible logic
const orderFields = computed(() => [
  {
    label: 'Supplier Booking ID',
    key: 'emergingOrderBookingFormResponse.data.order_id'
  },
  { label: 'Hotel Name', key: 'hotelId.name' },
  { label: 'No of Room', key: 'emergingOrderBookingFormPayload.guests.length' },
  {
    label: 'Number of Guests',
    isFunction: true,
    method: getGuestCount,
    args: ['emergingOrderBookingFinishPayload.rooms', 'adults']
  },
  {
    label: 'Lead Guest Name',
    key: 'emergingOrderBookingFinishPayload.rooms.0.guests.0.first_name'
  },
  { label: 'Room Type', key: 'rateHash.room_data_trans.main_name' },
  {
    label: 'Check-in',
    key: 'emergingOrderBookingFormPayload.checkin',
    isDate: true
  },
  {
    label: 'Check-out Date',
    key: 'emergingOrderBookingFormPayload.checkout',
    isDate: true
  },
  { label: 'Preference', key: 'customData.note' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Booking Done', key: 'emergingBookingDone', isBoolean: true },
  {
    label: 'Booking Confirmed',
    key: 'emergingBookingConfirmed',
    isBoolean: true
  },
  { label: 'Price', key: 'price' }
])
</script>
