import UserStateTypes from './modules/user/interface'
import PermissionStateTypes from './modules/permission/interface'
import AppStateTypes from './modules/app/interface'
import SettingsStateTypes from './modules/settings/interface'
import TagsViewStateTypes from './modules/tags-view/interface'

/** root层state类型定义 */
export default interface RootStateTypes {
  test: string
}

export interface AllStateTypes extends RootStateTypes {
  user: UserStateTypes
  permission: PermissionStateTypes
  settings: SettingsStateTypes
  app: AppStateTypes
  tags_view: TagsViewStateTypes
}

