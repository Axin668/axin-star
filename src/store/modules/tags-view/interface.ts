import { RouteLocationNormalized } from 'vue-router'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
  path?: string
}

export default interface TagsViewStateTypes {
  visitedViews: TagView[]
  cachedViews: string[]
}

