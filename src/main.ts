import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import axios from 'axios'
import { startAutoRefresh } from '@/util/eventBus';


const app = createApp(App)
app.config.globalProperties.$axios = axios
// 设置定时刷新 目前5分钟
startAutoRefresh(5 * 60 * 1000);
app.use(router)
app.mount('#app')
