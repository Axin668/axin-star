import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import AppStateTypes from './interface'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'

interface sidebarTypes {
  opened: boolean
  withoutAnimation: boolean
}

const appModule: Module<AppStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    device: useStorage<string>('device', 'desktop'),
    size: useStorage<string>('size', defaultSettings.size),
    sidebarStatus: useStorage<string>('sidebarStatus', 'closed'),
    language: useStorage<string>('language', 'zh-cn')
  },
  getters: {
    sidebar(state): sidebarTypes {
      return reactive({
        opened: state.sidebarStatus.value !== 'closed',
        withoutAnimation: false
      })
    }
  },
  mutations: {
    toggleDevice(state, val: string) {
      state.device.value = val
    },
    changeSize(state, val: string) {
      state.size.value = val
    }
  },
  actions: {
    closeSidebar({ state, getters }, withoutAnimation: boolean) {
      state.sidebarStatus.value = 'closed'
      getters.sidebar.opened = false
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    openSidebar({ state, getters }, withoutAnimation: boolean) {
      state.sidebarStatus.value = 'opened'
      getters.sidebar.opened = true
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    toggleSidebar({ state, getters }, withoutAnimation: boolean) {
      getters.sidebar.opened = !getters.sidebar.opened
      getters.sidebar.withoutAnimation = withoutAnimation
      if (getters.sidebar.opened) {
        state.sidebarStatus.value = 'opened'
      } else {
        state.sidebarStatus.value = 'closed'
      }
    }
  }
}

export default appModule

