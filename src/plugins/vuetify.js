/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    ...labsComponents
  },
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
      color: 'primary',
      hideDetails: 'auto'
    },
    VSelect: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary',
      hideDetails: 'auto'
    },
    VAutocomplete: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary',
      hideDetails: 'auto'
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
    },
    VFileInput: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary',
      hideDetails: 'auto'
    },
    VTextarea: {
      variant: 'outlined',
      clearable: true,
      density: 'compact',
      class: 'mb-2',
      color: 'primary',
      hideDetails: 'auto'
    },
    VDataTableServer: {
      height: '650px',
      fixedHeader: true,
      density: 'comfortable'
    }
  }
})
