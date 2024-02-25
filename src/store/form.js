// Utilities
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const userFormStore = defineStore('form', {
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  state: () => ({
    formComponents: {
      // type:['email','text','number','select']
      fields: [
        // { key: 'name', type: '', label: '', is_required: true, value: null },
        // {
        //   key: 'name',
        //   type: '',
        //   label: '',
        //   is_required: true,
        //   value: null,
        //   options: [],
        //   itemTitle: 'name',
        //   itemValue: 'id',
        //   multiple: false
        // }
      ],
      confirmFunction: () => {},
      reset: () => {},
      confirmText: 'Save',
      isSearched: false,
      selectedExportOption: null
    }
  }),
  actions: {
    setFormComponents(components) {
      this.formComponents = components
    },
    getFieldValue(key) {
      const field = this.formComponents.fields?.find(
        (field) => field?.key === key
      )
      return field ? field.value : null
    },
    updateField(key, value) {
      const fieldIndex = this.formComponents.fields.findIndex(
        (field) => field.key === key
      )

      if (fieldIndex !== -1) {
        this.formComponents.fields[fieldIndex].value = value
      }
    },
    updateOptions(key, value) {
      const fieldIndex = this.formComponents.fields.findIndex(
        (field) => field.key === key
      )

      if (fieldIndex !== -1) {
        this.formComponents.fields[fieldIndex].options = value
      }
    },
    getFilteredSearchFields() {
      return this.formComponents.fields
        .filter((field) => field.value !== null)
        .reduce((filteredFields, field) => {
          filteredFields[field.key] = field.value
          return filteredFields
        }, {})
    },
    hasValue() {
      const hasNonNullValue = Object.values(
        this.getFilteredSearchFields()
      ).some((value) => value !== null && value !== undefined)
      return hasNonNullValue
    }
  }
})
