/**
 * 管理员登录信息
 */
export interface ManagerInfo {
  managerId?: number
  managerName?: string
  avatar?: string
  roles: string[]
  perms: string[]
}

/**
 * 管理员查询对象类型
 */
export interface ManagerQuery extends global.PageQuery {
  keywords?: string;
  status?: number;
  deptId?: number;
}

/**
 * 管理员分页对象
 */
export interface ManagerPageVO {
  /**
   * 管理员头像地址
   */
  avatar?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 部门名称
   */
  deptName?: string;
  /**
   * 管理员邮箱
   */
  email?: string;
  /**
   * 性别
   */
  genderLabel?: string;
  /**
   * 管理员ID
   */
  id?: number;
  /**
   * 管理员手机号
   */
  mobile?: number;
  /**
   * 管理员拥有的角色名称, 多个使用英文逗号(,)分割
   */
  roleNames?: string;
  /**
   * 管理员状态(1:启用, 0:禁用)
   */
  status?: number;
  /**
   * 管理员名称
   */
  managerName?: string;
}

/**
 * 管理员表单类型
 */
export interface ManagerForm {
  /**
   * 管理员头像
   */
  avatar?: string;
  /**
   * 部门ID
   */
  deptId?: number;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 性别
   */
  gender?: number;
  /**
   * 管理员ID
   */
  id?: number;
  /**
   * 手机号
   */
  mobile?: string;
  /**
  * 角色ID集合
  */
  roleIds?: number[];
  /**
  * 管理员状态(1:正常, 0:禁用)
  */
  status?: number;
  /**
   * 管理员名称
   */
  managerName?: string;
}