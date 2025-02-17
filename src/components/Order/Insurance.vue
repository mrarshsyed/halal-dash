<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h6 font-weight-bold">Package Details</p>
      <p>
        Insurance Type:
        {{ orderDetails?.insurancePackage?.insuranceType?.name }}
      </p>
      <p>
        Insurance Area:
        {{ orderDetails?.insurancePackage?.insuranceArea?.name }}
      </p>
      <p>Trip Type: {{ orderDetails?.insurancePackage?.tripType }}</p>
      <p>
        Rest Type: {{ orderDetails?.insurancePackage?.insuranceRestType?.name }}
      </p>
      <p>
        Terrorism Extension:
        {{ orderDetails?.insurancePackage?.terrorismExtension ? 'YES' : 'NO' }}
      </p>
    </v-col>

    <v-col cols="12" md="6">
      <p class="font-weight-bold">Dates</p>
      <p>
        Start:
        {{ formateDate(orderDetails?.bookingPayload?.travelingDate?.start) }}
      </p>
      <p>
        End: {{ formateDate(orderDetails?.bookingPayload?.travelingDate?.end) }}
      </p>
    </v-col>

    <v-col cols="12" md="6">
      <p class="font-weight-bold">Status</p>
      <p>{{ orderDetails?.status }}</p>
    </v-col>

    <v-col cols="12" md="6">
      <p class="font-weight-bold">Payment Status</p>
      <p>{{ orderDetails?.paymentStatus }}</p>
    </v-col>

    <v-col cols="12" md="6">
      <p class="font-weight-bold">Price</p>
      <p>AED {{ orderDetails?.bookingPayload?.quotedPrice }}</p>
    </v-col>

    <v-col cols="12">
      <p class="text-h6 font-weight-bold">Guest Details</p>

      <div v-if="orderDetails?.bookingPayload?.travelerInformation">
        <GuestSection
          title="Adults"
          :guests="orderDetails.bookingPayload.travelerInformation.adults?.info"
        />
        <GuestSection
          title="Children"
          :guests="
            orderDetails.bookingPayload.travelerInformation.children?.info
          "
        />
        <GuestSection
          title="Seniors"
          :guests="
            orderDetails.bookingPayload.travelerInformation.seniors?.info
          "
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import GuestSection from '@/components/Order/InsuranceGuest.vue'
import { formateDate } from '@/utils/date'

defineProps({
  orderDetails: Object
})
</script>
