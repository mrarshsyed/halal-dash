<template>
  <div class="border pa-2 mt-4 pt-4" v-if="guests?.length">
    <p class="font-weight-bold">{{ title }}</p>
    <div class="mb-4" v-for="(guest, index) in guests" :key="index">
      <p>
        Name: {{ guest?.title }} {{ guest?.firstName }} {{ guest?.lastName }}
      </p>
      <p>Date Of Birth: {{ formateDate(guest?.dob) }}</p>
      <p>Country: {{ guest?.country }}</p>
      <p>Passport: {{ guest?.passportNumber || guest?.passport }}</p>
    </div>
  </div>
</template>

<script setup>
import { formateDate } from '@/utils/date'

defineProps({
  title: String,
  guests: Array
})
</script>
