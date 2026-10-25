<template>
  <div>
    <div class="d-flex align-center ga-2 mb-2">
      <span class="font-weight-bold">Halal Rating:</span>
      <span>{{ percentage ?? 0 }}%</span>
      <HalalClassBadge :halal-class="halalClass" />
      <span v-if="total != null" class="text-medium-emphasis">
        ({{ total }} points)
      </span>
    </div>
    <p v-if="!lines.length" class="text-medium-emphasis">
      No parameters have been scored yet.
    </p>
    <ul v-else class="ps-4">
      <li v-for="line in lines" :key="line.id">
        {{ line.name }} - {{ line.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HalalClassBadge from './HalalClassBadge.vue'

const props = defineProps({
  percentage: { type: Number, default: null },
  total: { type: Number, default: null },
  halalClass: { type: String, default: null },
  // halal_ratings_v2: [{ halal_rating: { _id, name }, score }]
  ratings: { type: Array, default: () => [] }
})

const scoreLabels = { 1: 'Matched', 0.5: 'Partially Matched', 0: 'Not Matched' }
const lines = computed(() =>
  (props.ratings ?? [])
    .filter((r) => r?.halal_rating)
    .map((r) => ({
      id: r.halal_rating._id,
      name: r.halal_rating.name,
      label: scoreLabels[r.score] ?? r.score
    }))
)
</script>
