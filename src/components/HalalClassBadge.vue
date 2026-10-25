<template>
  <v-chip v-if="label" size="small" :color="color" variant="flat">
    {{ label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'

// Shows nothing when halalClass is null or not one of the four known classes.
const props = defineProps({
  halalClass: { type: String, default: null }
})

const classes = {
  platinum: { label: 'Platinum', color: 'blue-grey-lighten-1' },
  gold: { label: 'Gold', color: 'amber-darken-2' },
  silver: { label: 'Silver', color: 'grey' },
  bronze: { label: 'Bronze', color: 'brown-lighten-1' }
}
const label = computed(() => classes[props.halalClass]?.label ?? '')
const color = computed(() => classes[props.halalClass]?.color ?? 'grey')
</script>
