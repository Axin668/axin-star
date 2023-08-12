// typings.d.ts or router.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    breadcrumb?: boolean
    affix?: boolean
    keepAlive?: boolean
  }
}

