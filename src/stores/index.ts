import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

// create pinia
const store = createPinia();
store.use(piniaPluginPersistedstate)

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
