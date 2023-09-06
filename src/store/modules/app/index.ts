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
const activeTopMenu = useStorage<string>('activeTopMenu', '')

const appModule: Module<AppStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    device: device.value,
    size: size.value,
    sidebarStatus: sidebarStatus.value,
    language: language.value,
    activeTopMenu: activeTopMenu.value
  },
  getters: {
    sidebar(state): sidebarTypes {
      return reactive({
        opened: state.sidebarStatus !== 'closed',
        withoutAnimation: false
      })
    }
  },
  mutations: {
    toggleDevice(state, val: string) {
      localStorage.setItem('device', val)
      state.device = val
    },
    changeSize(state, val: string) {
      localStorage.setItem('size', val)
      state.size = val
    },
    changeTopActive(state, val: string) {
      localStorage.setItem('activeTopMenu', val)
      state.activeTopMenu = val
    }
  },
  actions: {
    closeSidebar({ state, getters }, withoutAnimation: boolean) {
      state.sidebarStatus = 'closed'
      localStorage.setItem('sidebarStatus', 'closed')
      getters.sidebar.opened = false
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    openSidebar({ state, getters }, withoutAnimation: boolean) {
      state.sidebarStatus = 'opened'
      localStorage.setItem('sidebarStatus', 'opened')
      getters.sidebar.opened = true
      getters.sidebar.withoutAnimation = withoutAnimation
    },
    toggleSidebar({ state, getters }, withoutAnimation: boolean) {
      getters.sidebar.opened = !getters.sidebar.opened
      getters.sidebar.withoutAnimation = withoutAnimation
      if (getters.sidebar.opened) {
        state.sidebarStatus = 'opened'
        localStorage.setItem('sidebarStatus', 'opened')
      } else {
        state.sidebarStatus = 'closed'
        localStorage.setItem('sidebarStatus', 'closed')
      }
    }
  }
}

export default appModule

