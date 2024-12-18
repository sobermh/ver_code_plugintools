import 'normalize.css'
import { createApp } from 'vue'
import vuetify from './plugins/vuetify.ts'


import App from './App.vue'
import router from './router'
import pinia from './store'



const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
