import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'
import Store, {key} from './store'

const app = createApp(App)
for(const name in ElIcons) {
    app.component(name, (ElIcons as any)[name])
}

app.use(router).use(ElementPlus)
app.use(Store, key)

app.mount('#app')