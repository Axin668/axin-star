declare namespace global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number
    pageSize: number
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    list: T
    /**
     * 数据总数
     */
    total: number
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string
    /**
     * 是否显示
     */
    visible: boolean
  }
  /**
   * 组件数据源
   */
  interface OptionType {
    /**
     * 值
     */
    value: string | number
    /**
     * 文本
     */
    label: string
    /**
     * 子列表
     */
    children?: OptionType[]
  }
}

/* Menu */
declare namespace Menu {
  interface MenuOptions {
    path: string;
    name: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: MetaProps;
    children?: MenuOptions[];
  }
  interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
  }
}

/* FileType */
declare namespace File {
  type ImageMimeType =
    | "image/apng"
    | "image/bmp"
    | "image/gif"
    | "image/jpeg"
    | "image/pjpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/tiff"
    | "image/webp"
    | "image/x-icon";

  type ExcelMimeType = "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}