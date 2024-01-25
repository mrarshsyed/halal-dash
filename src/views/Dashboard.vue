<template>
  <div>
    <h1>{{ store?.getUser }}</h1>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const store = useAppStore()
</script>

<style lang="scss" scoped></style>
