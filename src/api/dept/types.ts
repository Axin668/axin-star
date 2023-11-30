/**
 * 部门查询参数
 */
export interface DeptQuery {
    keywords?: string;
    status?: number;
}

/**
 * 部门视图对象
 */
export interface DeptVO {
    /**
     * 子部门
     */
    children?: DeptVO[];
    /**
     * 部门ID
     */
    id?: number;
    /**
     * 部门名称
     */
    name?: string;
    /**
     * 父部门ID
     */
    parentId?: number;
    /**
     * 排序
     */
    sort?: number;
    /**
     * 状态(1:启用;0:禁用)
     */
    status?: number;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 修改时间
     */
    updateTime?: Date;
}

/**
 * 部门表单类型
 */
export interface DeptForm {
    /**
     * 部门ID(新增不填, 由后端默认填充)
     */
    id?: number;
    /**
     * 部门名称
     */
    name?: string;
    /**
     * 父部门ID
     */
    parentId?: number;
    /**
     * 排序
     */
    sort?: number;
    /**
     * 状态(1:启用;0:禁用)
     */
    status?: number;
}