import { createApp } from 'vue'
import App from './App.vue'

// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// font css
import "@/assets/fonts/font.scss";
// element css
import 'element-plus/dist/index.css'
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css'
// custom element dark css
import "@/styles/element-dark.scss";
// custom element css
import "@/styles/element.scss";
// uno css
import 'uno.css'
// svg icons
import 'virtual:svg-icons-register'
// element plus
import ElementPlus from 'element-plus'
// element icons
import * as Icons from "@element-plus/icons-vue";
// vue Router
import router from './router'
// custom directives
import { setupDirective } from "@/directive";
// pinia store
import { setupStore } from "@/stores";

//加载脚本 (要放在前边, 因为下边的lang国际化要用到Hook)
import '@/permission'

// 国际化
import i18n from "@/languages/index";

const app = createApp(App)

// register the element Icons component
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons]);
});

setupDirective(app) // 全局注册 自定义指令(directive)
setupStore(app); // 全局注册 状态管理(store)
app.use(router).use(ElementPlus).use(i18n).mount('#app')

