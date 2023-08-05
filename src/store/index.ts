import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { InjectionKey } from 'vue'
import RootStateTypes, { AllStateTypes } from './interface'
import modules from './modules'

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')

export default createStore<RootStateTypes>({
  modules: modules,
})

// 简化useStore(key)
export function useStore<T = AllStateTypes>() {
  return baseUseStore<T>(key)
}
