<template>
  <v-dialog v-model="dialog.show" max-width="600" persistent scrollable>
    <v-card :title="dialog.title">
      <v-card-text>
        {{ dialog.content }}
        <v-form
          v-model="formValue"
          v-if="dialog?.formComponents?.fields?.length"
          ref="form"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
              v-for="(component, index) in dialog.formComponents?.fields"
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
                item-title="title"
                item-value="id"
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
        </v-form>
      </v-card-text>
      <v-card-actions class="pt-4 pr-4">
        <v-spacer />
        <v-btn
          color="error"
          variant="outlined"
          class="px-4"
          @click="store.closeDialog"
        >
          {{ dialog.cancelText }}
        </v-btn>
        <v-btn @click="confirm" class="px-4" color="primary" variant="elevated">
          {{ dialog.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { computed, ref } from 'vue'
const store = useAppStore()
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

const dialog = computed(() => {
  return store.dialog
})
const confirm = async () => {
  if (dialog.value?.formComponents?.fields?.length) {
    const needToValidate = dialog.value?.formComponents?.fields?.filter(
      (x) => x?.isRequired
    )
    if (needToValidate?.length) {
      form.value.validate()
      if (form.value.isValid) {
        await dialog.value.confirmFunction()
      }
    }
  } else {
    await dialog.value.confirmFunction()
  }
}
</script>
