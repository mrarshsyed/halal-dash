<template>
  <div>
    <h4>
      <v-icon icon="mdi-account-circle"> </v-icon> Hi, {{ store?.getUserName }}
    </h4>
    <p>Welcome To Dashboard</p>
    <p class="my-4">Modules</p>
    <v-row>
      <v-col cols="12" :md="4" v-for="(m, index) in modules">
        <v-card :to="m.to">
          <div class="text-center">
            <v-icon
              color="primary"
              size="x-large"
              :icon="'mdi-' + m.icon"
            ></v-icon>
          </div>
          <v-card-title>
            {{ m?.title }}
          </v-card-title>
          <v-card-text>
            {{ m?.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
const modules = [
  {
    title: 'Users Management',
    icon: 'account-circle',
    description: 'Manage All Users',
    to: '/users'
  }
]
</script>

<style lang="scss" scoped></style>
