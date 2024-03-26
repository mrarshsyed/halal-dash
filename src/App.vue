<template>
  <v-app>
    <Navbar>
      <router-view :key="$route.query" />
    </Navbar>
    <!-- <Loader /> -->
    <Snackbar />
    <DialogComponent />
  </v-app>
</template>

<script setup>
import '@/styles/main.css'
// import Loader from '@/components/Loader.vue'
import Navbar from '@/components/Navbar.vue'
import Snackbar from '@/components/Snackbar.vue'
import DialogComponent from './components/DialogComponent.vue'
//
</script>
