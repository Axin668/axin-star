import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import { setupDirective } from "@/directive";
import { setupStore } from "@/stores";

//加载脚本 (要放在前边, 因为下边的lang国际化要用到Hook)
import '@/permission'

//svg图标注册脚本
import 'virtual:svg-icons-register'

// 国际化
import i18n from "@/lang/index";

// 样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import 'uno.css'

const app = createApp(App)

setupDirective(app) // 全局注册 自定义指令(directive)
setupStore(app); // 全局注册 状态管理(store)
app.use(router).use(ElementPlus).use(i18n)

app.mount('#app')

