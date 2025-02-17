<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Supplier Booking ID
      </p>
      <p>{{ orderDetails?.hotelbedsBookingResponse?.reference }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Activity Name
      </p>
      <p>{{ orderDetails?.activity?.name }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        No of Guests
      </p>
      <p>{{ orderDetails?.bookingPayload?.activities[0]?.paxes?.length }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Lead Guest Name
      </p>
      <p>
        {{
          orderDetails?.bookingPayload?.activities[0]?.paxes[0]?.surname
        }}
        {{ orderDetails?.bookingPayload?.activities[0]?.paxes[0]?.name }}
      </p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Pick Up Place
      </p>
      <p>{{ orderDetails?.bookingPayload?.customObjects?.pickup }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Drop Off Place
      </p>
      <p>{{ orderDetails?.bookingPayload?.customObjects?.dropOff }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Preference
      </p>
      <p>{{ orderDetails?.bookingPayload?.customObjects?.note }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Status
      </p>
      <p>{{ orderDetails?.status }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Total Amount
      </p>
      <p>AED {{ orderDetails?.price }}</p>
    </v-col>
  </v-row>
</template>
  
  <script setup>
  defineProps({
    orderDetails: Object,
  });
  </script>
  