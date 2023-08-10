import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import SettingsStateTypes from './interface'
import { useStorage } from '@vueuse/core'
import defaultSettings from '@/settings'

//不支持动态绑定RemovableRef<boolean> -> boolean, 所以先取出来再.value赋值
const tagView = useStorage<boolean>('tagView', defaultSettings.tagsView)
const layout = useStorage<string>('layout', defaultSettings.layout)

const SettingsModule: Module<SettingsStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    tagView: tagView.value,
    showSettings: defaultSettings.showSettings,
    fixedHeader: defaultSettings.fixedHeader,
    sidebarLogo: defaultSettings.sidebarLogo,
    layout: layout.value
  },
  actions: {
    changeSetting({ state }, param: { key: string; value: any }) {
      const { key, value: val } = param
      switch (key) {
        case 'showSettings':
          state.showSettings = val
          break
        case 'fixedHeader':
          state.fixedHeader = val
          break
        case 'sidebarLogo':
          state.sidebarLogo = val
          break
        case 'tagView':
          state.tagView = val
          break
        case 'layout':
          state.layout = val
          break
        default:
          break
      }
    }
  }
}

export default SettingsModule

