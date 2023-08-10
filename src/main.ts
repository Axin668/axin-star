import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Store, { key } from './store'
import 'virtual:svg-icons-register'
// 样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import 'uno.css'

const app = createApp(App)

app.use(router).use(ElementPlus)
app.use(Store, key)

app.mount('#app')

