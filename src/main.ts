import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

import 'primevue/resources/themes/lara-light-indigo/theme.css' //theme
import 'primevue/resources/primevue.min.css' // core
import 'primeicons/primeicons.css' //icons

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')
