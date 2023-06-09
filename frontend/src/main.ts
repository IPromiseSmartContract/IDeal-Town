import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

import 'primevue/resources/themes/lara-light-indigo/theme.css' //theme
import 'primevue/resources/primevue.min.css' // core
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css'
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';

import './assets/main.css'
import Ripple from 'primevue/ripple';

const app = createApp(App)

app.use(ToastService);
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(DialogService);

app.directive('ripple', Ripple);

app.mount('#app')
