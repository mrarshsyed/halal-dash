<template>
  <div>
    <h2>{{ hotel?.name }}</h2>
    <p>country : {{ hotel?.countryName }}</p>
    <p>City : {{ hotel?.destinationName }}</p>
    <p class="mt-8 d-flex ga-4 align-center">
      <v-icon size="x-large" icon="mdi-account-circle"></v-icon>
      <span>{{ hotel?.manager?.name }} <br />{{ hotel?.manager?.email }}</span>
      <v-chip variant="tonal" class="font-weight-bold"
        >{{ hotel?.halal_ratings_percentage }} %</v-chip
      >
    </p>
    <div class="mt-8">
      <p>Modalities</p>
      <v-row class="mt-2">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="(item, index) in hotel?.modalities"
        >
          <v-card>
            <v-card-title>
              {{ item?.name }}
            </v-card-title>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- <v-row class="mt-8">
      <v-col cols="12"><p>Image Gallery</p></v-col>
      <v-col
        cols="6"
        md="4"
        lg="3"
        xxl="2"
        v-for="(img, index) in hotel?.images?.slice(0, 9)"
        :key="index"
      >
        <v-img
          height="200"
          width="full"
          :src="img ? img?.replace('{size}', '1024x768') : ''"
          cover
          class="rounded"
        >
        </v-img>
      </v-col>
    </v-row> -->
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { watch } from 'vue'
import { computed } from 'vue'

const store = useAppStore()

const hotel = computed(() => {
  return store.details
})
</script>

<style lang="scss" scoped></style>
