/**
 * 系统设置
 */
interface DefaultSettings {
  /**
   * 系统title
   */
  title: string
  /**
   * 是否显示设置
   */
  showSettings: boolean
  /**
   * 是否显示多标签导航
   */
  tagsView: boolean
  /**
   *是否固定头部
   */
  fixedHeader: boolean
  /**
   * 是否显示侧边栏Logo
   */
  sidebarLogo: boolean
  /**
   * 导航栏布局(left|top|mix)
   */
  layout: string
  /**
   * 主题模式(dark|light)
   */
  theme: string

  /**
   * 布局大小(default |large |small)
   */
  size: string

  /**
   * 语言( zh-cn| en)
   */
  language: string
}

const defaultSettings: DefaultSettings = {
  title: 'axin-star',
  showSettings: true,
  tagsView: true,
  fixedHeader: false,
  sidebarLogo: true,
  layout: 'left',
  /**
   * 主题模式
   *
   * dark: 暗黑模式
   * light: 明亮模式
   */
  theme: 'dark',
  size: 'default',
  language: 'zh-cn'
}

export default defaultSettings

