<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800"
    scrollable
    persistent
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <div v-for="group in groups" :key="group.name" class="mb-4">
          <p class="font-weight-bold mb-2">{{ group.name }}</p>
          <div
            v-for="r in group.items"
            :key="r._id"
            class="d-flex align-center ga-4 mb-2"
          >
            <div class="flex-grow-1 d-flex flex-wrap align-center ga-2">
              <span>{{ r?.name }}</span>
              <v-chip size="small">{{ r?.rating }}</v-chip>
              <v-chip
                v-for="cls in r?.mandatoryForClass"
                :key="cls"
                size="small"
                color="primary"
                variant="tonal"
              >
                Mandatory: {{ classLabels[cls] ?? cls }}
              </v-chip>
            </div>
            <v-select
              v-model="scores[r._id]"
              :items="scoreOptions"
              item-title="title"
              item-value="value"
              density="compact"
              clearable
              placeholder="Not set"
              style="min-width: 200px; max-width: 200px"
              hide-details
            />
          </div>
        </div>
        <p v-if="!groups.length" class="text-medium-emphasis">
          No parameters have been added yet.
        </p>
        <v-alert v-if="error" type="error" class="mt-4" density="compact">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="ma-2">
        <p>
          Preview: {{ previewPoints }} out of {{ catalogTotal }} points ({{
            previewPercentage
          }}%)
          <v-chip v-if="previewClass" class="ms-2" size="small" color="primary">
            {{ classLabels[previewClass] }}
          </v-chip>
          <span v-else class="ms-2 text-medium-emphasis">No class</span>
        </p>
        <v-spacer />
        <v-btn color="error" @click="close"> Close </v-btn>
        <v-btn color="primary" :loading="saving" @click="onSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from '@/plugins/axios'
import { useAppStore } from '@/store/app'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Select Rating' },
  // Full parameter catalog for the module (admin/<module>-halal-ratings).
  ratings: { type: Array, default: () => [] },
  // Current halal_ratings_v2 of the restaurant / ship: [{ halal_rating, score }]
  selected: { type: Array, default: () => [] },
  // PATCH url that receives { ratingIds }
  saveUrl: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const store = useAppStore()

const scoreOptions = [
  { title: 'Matched', value: 1 },
  { title: 'Partially Matched', value: 0.5 },
  { title: 'Not Matched', value: 0 }
]
const classLabels = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze'
}
const classOrder = ['platinum', 'gold', 'silver', 'bronze']

const scores = ref({}) // { [parameterId]: 1 | 0.5 | 0 | null }
const error = ref('')
const saving = ref(false)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    error.value = ''
    scores.value = {}
    for (const item of props.selected ?? []) {
      const id = item?.halal_rating?._id
      if (id) scores.value[id] = item.score ?? 1
    }
  }
)

const groups = computed(() => {
  const map = new Map()
  for (const r of props.ratings) {
    const name = r?.category?.name ?? 'Other'
    if (!map.has(name)) map.set(name, { name, items: [] })
    map.get(name).items.push(r)
  }
  return [...map.values()]
})

// Untouched parameters are omitted, so only parameters with a score count as rows.
const rows = computed(() =>
  Object.entries(scores.value)
    .filter(([, score]) => score !== null && score !== undefined)
    .map(([id, score]) => ({ halal_rating: id, score }))
)
const catalogTotal = computed(() =>
  props.ratings.reduce((total, r) => total + Number(r.rating || 0), 0)
)
const previewPoints = computed(() =>
  rows.value.reduce((total, row) => {
    const param = props.ratings.find((r) => r._id === row.halal_rating)
    return total + Number(param?.rating || 0) * row.score
  }, 0)
)
const previewPercentage = computed(() =>
  catalogTotal.value > 0 && rows.value.length
    ? Math.ceil((previewPoints.value / catalogTotal.value) * 100)
    : 0
)
// Preview only; the saved class comes from the API response.
const previewClass = computed(() => {
  if (!rows.value.length || catalogTotal.value <= 0) return null
  const pct = previewPercentage.value
  const start = pct >= 80 ? 0 : pct >= 60 ? 1 : pct >= 40 ? 2 : 3
  for (const cls of classOrder.slice(start)) {
    const mandatory = props.ratings.filter((r) =>
      (r.mandatoryForClass ?? []).includes(cls)
    )
    if (mandatory.every((r) => scores.value[r._id] === 1)) return cls
  }
  return null
})

const ratingErrorMessages = {
  'Ratings ids must be a array': 'No scores were sent. Please try again.',
  'halal_rating is not an id':
    'A parameter id was missing or invalid. Reload the parameter list.'
}
const describeError = (msg) => {
  if (ratingErrorMessages[msg]) return ratingErrorMessages[msg]
  if (msg.startsWith('Invalid halal rating ids'))
    return 'A parameter was not found in this catalog. Reload the parameter list.'
  if (/score/i.test(msg)) return 'A score other than Matched, Partially Matched or Not Matched was sent.'
  return msg
}

const close = () => {
  scores.value = {}
  error.value = ''
  emit('update:modelValue', false)
}
const onSave = async () => {
  error.value = ''
  saving.value = true
  try {
    const res = await axios.patch(props.saveUrl, { ratingIds: rows.value })
    const data = res?.data
    store.showSnackbar(
      `Ratings updated successfully (${data?.halal_ratings_percentage_v2 ?? 0}%, ${
        data?.halal_ratings_total_v2 ?? 0
      } points, ${classLabels[data?.halal_class] ?? 'no class'})`
    )
    emit('saved', data)
    close()
  } catch (e) {
    const msg = e?.response?.data?.validationErrors?.ratingIds
    if (msg) error.value = describeError(String(msg))
  } finally {
    saving.value = false
  }
}
</script>
