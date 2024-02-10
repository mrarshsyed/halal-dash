<template>
  <v-form
    v-if="store.formComponents.fields?.length"
    v-model="formValue"
    ref="form"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        xl="3"
        v-for="(component, index) in store.formComponents?.fields"
        :key="index"
      >
        <v-text-field
          :type="component?.type"
          v-if="
            component?.type === 'email' ||
            component?.type === 'text' ||
            component?.type === 'number'
          "
          :label="component?.label"
          :required="component?.isRequired"
          :rules="getValidationRules(component)"
          v-model="component.value"
        ></v-text-field>
        <v-autocomplete
          clearable
          v-if="component?.type === 'select'"
          :label="component?.label"
          :items="component?.options ?? []"
          :item-title="component?.itemTitle ?? 'title'"
          :item-value="component?.itemValue ?? 'id'"
          :multiple="component?.multiple"
          :required="component?.isRequired"
          :rules="
            component?.isRequired
              ? [(v) => !!v || `${component?.label} is required`]
              : []
          "
          v-model="component.value"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row class="justify-end">
      <v-col cols="12" md="4"
        ><v-btn
          block
          color="error"
          variant="outlined"
          class="px-4"
          @click="reset"
          >Reset
        </v-btn></v-col
      >
      <v-col cols="12" md="4">
        <v-btn
          block
          @click="confirm"
          class="px-4"
          color="primary"
          variant="elevated"
        >
          {{ store.formComponents.confirmText ?? 'Save' }}
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        md="4"
        v-if="store.formComponents.isSearched && store.hasValue()"
      >
        <v-select
          label="Export Data"
          :items="[
            { title: 'Current Page', value: 'current_page' },
            { title: 'Current List', value: 'current_list' }
          ]"
          item-key="title"
          item-value="value"
          v-model="store.formComponents.selectedExportOption"
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup>
import { userFormStore } from '@/store/form'
import { ref } from 'vue'
const store = userFormStore()

const form = ref()
const formValue = ref(false)

const getValidationRules = (component) => {
  const commonRules = component?.isRequired
    ? [(v) => !!v || `${component?.label} is required`]
    : []

  if (component?.type === 'email') {
    return [
      ...commonRules,
      (v) =>
        (component?.type === 'email' && !v) ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'E-mail must be valid'
    ]
  }

  return commonRules
}
const confirm = async () => {
  if (store.formComponents?.fields?.length) {
    const needToValidate = store?.formComponents?.fields?.filter(
      (x) => x?.isRequired
    )

    if (!needToValidate?.length) {
      await store.formComponents.confirmFunction()
    } else {
      form.value.validate()
      if (form.value.isValid) {
        await store.formComponents.confirmFunction()
      }
    }
  }
}
const reset = async () => {
  form.value.reset()
  store.formComponents.isSearched = false
  await store.formComponents.reset()
}
</script>
