import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import axios from 'axios'


const app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(router)
app.mount('#app')
