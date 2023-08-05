import UserStateTypes from './modules/user/interface'
import PermissionStateTypes from './modules/permission/interface'

/** root层state类型定义 */
export default interface RootStateTypes {
  test: string
}

export interface AllStateTypes extends RootStateTypes {
  user: UserStateTypes
  permission: PermissionStateTypes
}

