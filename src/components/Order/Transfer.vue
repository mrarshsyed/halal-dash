<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Supplier Booking ID
      </p>
      <p>{{ orderDetails?.bookingInfo?.bookings?.[0]?.reference }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Transfer Type
      </p>
      <p>{{ orderDetails?.service?.transferType }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Pick Up Place
      </p>
      <p>{{ orderDetails?.search?.from?.description }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Drop Off Place
      </p>
      <p>{{ orderDetails?.search?.to?.description }}</p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Flight Code
      </p>
      <p>
        {{
          orderDetails?.bookingPayload?.transfers?.[0]
            ?.transferDetails?.[0]?.code
        }}
      </p>
    </v-col>
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Flight Time
      </p>
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
  
    <v-col
      cols="12"
      md="6"
    >
      <p class="font-weight-bold">
        Preferences
      </p>
      <p>{{ orderDetails?.bookingPayload?.remark }}</p>
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
      <p>EUR {{ orderDetails?.price }}</p>
    </v-col>
  </v-row>
</template>
  
  <script setup>
  defineProps({
    orderDetails: Object,
  });
  </script>
  