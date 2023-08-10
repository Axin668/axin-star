import { Ref } from 'vue'

export default interface AppStateTypes {
  device: Ref<string>
  size: Ref<any>
  sidebarStatus: Ref<string>
  language: Ref<string>
}

