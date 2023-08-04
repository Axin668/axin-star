import { createStore, useStore as baseUseStore, Store } from "vuex";
import { InjectionKey } from "vue";
import modules from "./modules";

export const key: InjectionKey<Store<state>> = Symbol("key");

export type state = {
  count: number;
};

export default createStore({
  modules: modules,
});

// 简化useStore(key)
export function useStore() {
  return baseUseStore(key);
}
