/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6'
        }
      }
    }
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary'
    },
    VAutocomplete: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary'
    },
    VCard: {
      class: 'py-5'
    },
    VChip: {
      label: true,
      variant: 'outlined',
      size: 'small',
      color: 'primary',
      class: 'text-capitalize font-weight-bold'
    },
    VDialog: {
      maxWidth: '600px',
      persistent: true,
      scrollable: true,
      color: 'primary'
    },
    VCheckbox: {
      hideDetails: 'auto',
      color: 'primary'
    }
  }
})
