import { MenuTypeEnum } from '@/enums/MenuTypeEnum'

/**
 * 菜单查询参数模型
 */
export interface MenuQuery {
  keywords?: string
}

/**
 * 菜单视图对象模型
 */
export interface MenuVO {
  /**
   * 菜单ID
   */
  id?: number
  /**
   * 菜单名称
   */
  name?: string
  /**
   * 父菜单ID
   */
  parentId?: number
  /**
   * 按钮权限标识
   */
  perm?: string
  /**
   * 跳转路径
   */
  redirect?: string
  /**
   * 路由名称
   */
  routeName?: string
  /**
   * 路由相对路径
   */
  path: string
  /**
   * 菜单排序(数字越小排名越靠前)
   */
  sort?: number
  /**
   * 菜单类型
   */
  type?: MenuTypeEnum
  /**
   * 菜单是否可见(1: 显示; 0: 隐藏)
   */
  visible?: number
  /**
   * 菜单icon
   */
  icon?: string
  /**
   *  组件路径
   */
  component?: string
  /**
   * 子菜单
   */
  children?: MenuVO[]
  /**
   * 菜单是否固定在 tab 上(目前暂未使用)
   */
  isAffix?: boolean
  /**
   * 菜单是否保持缓存(目前暂未使用)
   */
  isKeepAlive?: boolean
}

/**
 * 菜单表单对象类型
 */
export interface MenuForm {
  /**
   * 菜单ID(注意表单是string)
   */
  id?: string
  /**
   * 父菜单ID
   */
  parentId?: number
  /**
   * 菜单名称
   */
  name?: string
  /**
   * 菜单是否可见(1: 是; 0: 否)
   */
  visible?: number
  /**
   * 菜单icon
   */
  icon?: string
  /**
   * 菜单排序
   */
  sort?: number
  /**
   * 组件路径
   */
  component?: string
  /**
   * 路由相对路径
   */
  path?: string
  /**
   * 跳转路径
   */
  redirect?: string
  /**
   * 菜单类型
   */
  type: MenuTypeEnum
  /**
   * 权限标识
   */
  perm?: string
}

