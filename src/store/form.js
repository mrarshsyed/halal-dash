// Utilities
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

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
        { key: 'name', type: '', label: '', is_required: true, value: null },
        {
          key: 'name',
          type: '',
          label: '',
          is_required: true,
          value: null,
          options: [],
          itemTitle: 'name',
          itemValue: 'id',
          multiple: false
        }
      ],
      confirmFunction: () => {},
      reset: () => {},
      confirmText: 'Save',
      isSearched: false
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
    }
  }
})
