import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import AppStateTypes from './interface'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'

interface sidebarTypes {
  opened: boolean
  withoutAnimation: boolean
}

const device = useStorage<string>('device', 'desktop')
const size = useStorage<string>('size', defaultSettings.size)
const sidebarStatus = useStorage<string>('sidebarStatus', 'closed')
const language = useStorage<string>('language', 'zh-cn')

const appModule: Module<AppStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    device: device.value,
    size: size.value,
    sidebarStatus: sidebarStatus.value,
    language: language.value
  },
  getters: {
    sidebar(state): sidebarTypes {
      console.log(666)
      return reactive({
        opened: state.sidebarStatus !== 'closed',
        withoutAnimation: false
      })
    }
  },
  mutations: {
    toggleDevice(state, val: string) {
      console.log(val)
      state.device = val
    },
    changeSize(state, val: string) {
      state.size.value = val
    }
  },
  actions: {
    closeSidebar({ state, getters }, withoutAnimation: boolean) {
      console.log(999)
      state.sidebarStatus = 'closed'
      getters.sidebar.opened = false
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    openSidebar({ state, getters }, withoutAnimation: boolean) {
      console.log(888)
      state.sidebarStatus = 'opened'
      getters.sidebar.opened = true
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    toggleSidebar({ state, getters }, withoutAnimation: boolean) {
      console.log(777)
      getters.sidebar.opened = !getters.sidebar.opened
      getters.sidebar.withoutAnimation = withoutAnimation
      if (getters.sidebar.opened) {
        state.sidebarStatus = 'opened'
      } else {
        state.sidebarStatus = 'closed'
      }
    }
  }
}

export default appModule

