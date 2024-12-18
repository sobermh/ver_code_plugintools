// Styles
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// const CustomTheme = {
//   dark: true,
//   colors: {
//     background: '#0F0E13',
//     primary: '#151419',
//     surface: '#23242A',
//     secondary: '#333438',
//     error: '#B00020',
//     info: '#222428',
//     success: '#4CAF50',
//     warning: '#FB8C00',
//   }
// }


export default createVuetify({
  components: {
    ...components,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'dark',
  },
})
