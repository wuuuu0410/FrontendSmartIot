import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '../src/views/App.vue'
import router from './router'
import 'sweetalert2/dist/sweetalert2.min.css'; // 引入 SweetAlert2 的 CSS


const pinia = createPinia()
const app = createApp(App)

app.use(router)

app.use(pinia)
app.mount('#app')
