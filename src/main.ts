import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import Store, { key } from './store'

//svg图标注册脚本
import 'virtual:svg-icons-register'
// 样式
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import 'uno.css'

//加载脚本
import '@/permission'

const app = createApp(App)

app.use(router).use(ElementPlus)
app.use(Store, key)

app.mount('#app')

