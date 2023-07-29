import { createStore, useStore as baseUseStore, Store } from "vuex";
import { InjectionKey } from "vue"

export const key: InjectionKey<Store<state>> = Symbol('key')

export type state = {
    count: number
}

export default createStore({
    state: {
        count: 0
    },
    mutations: {
        add(state) {
            state.count += 1
        }
    }
})

// 简化useStore(key)
export function useStore() {
    return baseUseStore(key)
}