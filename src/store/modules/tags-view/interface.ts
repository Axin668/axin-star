import { RouteLocationNormalized } from 'vue-router'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export default interface TagsViewStateTypes {
  visitedViews: Ref<TagView[]>
  cachedViews: Ref<string[]>
}

