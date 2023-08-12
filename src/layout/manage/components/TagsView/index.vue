<template>
  <div class="tags-container">
    <scroll-pane
      ref="scrollPaneRef"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        :key="tag.value.fullPath"
        :class="'tags-item' + (isActive(tag.value) ? 'active' : '')"
        :data-path="tag.value.path"
        :to="{ path: tag.value.path, query: tag.value.query }"
        @click.middle="!isAffix(tag.value) ? closeSelectedTag(tag.value) : ''"
        @contextmenu.prevent="openTagMenu(tag.value, $event)"
      >
        {{ tag.value.meta?.title }}
        <span
          v-if="!isAffix(tag.value)"
          class="tags-item-close"
          @click.prevent.stop="closeSelectedTag(tag.value)"
        >
          <i-ep-close class="text-[10px]" />
        </span>
      </router-link>
    </scroll-pane>

    <!-- tag标签操作菜单 -->
    <ul
      v-show="tagMenuVisible"
      class="tag-menu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        刷新
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
        <svg-icon icon-class="close" />
        关闭
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li
        v-if="!isFirstView()"
        @click="closeLeftTags"
      >
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li
        v-if="!isLastView()"
        @click="closeRightTags"
      >
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import path from 'path-browserify'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { TagView } from '@/store/modules/tags-view/interface'
import ScrollPane from './ScrollPane.vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const router = useRouter()
const route = useRoute()

const store = useStore()

const visitedViews = toRefs(store.state.tags_view.visitedViews)
const selectedTag = ref({})
const scrollPaneRef = ref()
const left = ref(0)
const top = ref(0)
const affixTags = ref<TagView[]>([])

watch(
  route,
  () => {
    addTags()
    moveToCurrentTag()
  },
  {
    //初始化立即执行
    immediate: true
  }
)

const tagMenuVisible = ref(false) //标签操作菜单显示状态
watch(tagMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeTagMenu)
  } else {
    document.body.removeEventListener('click', closeTagMenu)
  }
})

function filterAffixTags(routes: any[], basePath = '/') {
  let tags: TagView[] = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      if (childTags.length >= 1) {
        tags = tags.concat(childTags)
      }
    }
  })
  return tags
}

function initTags() {
  const tags: TagView[] = filterAffixTags(store.state.permission.routes)
  affixTags.value = tags
  for (const tag of tags) {
    //tag必须有名字
    if (tag.name) {
      store.dispatch('tags_view/addVistedView', tag)
    }
  }
}

function addTags() {
  if (route.name) {
    store.dispatch('tags_view/addView', route)
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    for (const r of store.state.tags_view.visitedViews) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r)
        if (r.fullPath !== route.fullPath) {
          store.dispatch('tags_view/updateVisitedView', route)
        }
      }
    }
  })
}

function isActive(tag: TagView) {
  return tag.path === route.path
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix
}

function isFirstView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
        store.state.tags_view.visitedViews.at(1)?.fullPath ||
      (selectedTag.value as TagView).fullPath === '/index'
    )
  } catch (error) {
    return false
  }
}

function isLastView() {
  try {
    const len = store.state.tags_view.visitedViews.length
    return (
      (selectedTag.value as TagView).fullPath ===
        store.state.tags_view.visitedViews.at(len - 1)?.fullPath ||
      (selectedTag.value as TagView).fullPath === '/index'
    )
  } catch (error) {
    return false
  }
}

function refreshSelectedTag(view: TagView) {
  store.dispatch('tags_view/delCachedView', view)
  const { fullPath } = view
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath }).catch((err) => {
      console.log(err)
    })
  })
}

function toLastView(visitedViews: TagView[], view?: any) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function closeSelectedTag(view: TagView) {
  store.dispatch('tags_view/delView', view).then((res: any) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view)
    }
  })
}

function closeLeftTags() {
  store
    .dispatch('tags_view/delLeftViews', selectedTag.value)
    .then((response: any) => {
      if (
        !response.visitedViews.find(
          (item: any) => item.fullPath === route.fullPath
        )
      ) {
        toLastView(response.visitedViews)
      }
    })
}

function closeRightTags() {
  store
    .dispatch('tags_view/delRightViews', selectedTag.value)
    .then((response: any) => {
      if (
        !response.visitedViews.find(
          (item: any) => item.fullPath === route.fullPath
        )
      ) {
        toLastView(response.visitedViews)
      }
    })
}

function closeOtherTags() {
  router.push(selectedTag.value)
  store.dispatch('tags_view/delOtherViews', selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

function closeAllTags(view: TagView) {
  store.dispatch('tags_view/delAllViews').then((response: any) => {
    toLastView(response.visitedViews, view)
  })
}

function openTagMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105

  const offsetLeft = proxy?.$el.getBoundingClientRect().left //container margin left
  const offsetWidth = proxy?.$el.offsetWidth //container width
  const maxLeft = offsetWidth - menuMinWidth //left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY
  tagMenuVisible.value = true
  selectedTag.value = tag
}

function closeTagMenu() {
  tagMenuVisible.value = false
}

function handleScroll() {
  closeTagMenu()
}

onMounted(() => {
  initTags()
})
</script>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);

  .tags-item {
    display: inline-block;
    padding: 3px 8px;
    margin: 4px 0 0 5px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);
  }

  &:first-of-type {
    margin-left: 15px;
  }

  &:last-of-type {
    margin-right: 15px;
  }

  &:hover {
    color: var(--el-color-primary);
  }

  &.active {
    color: #fff;
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);

    &::before {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 5px;
      content: '';
      background: #fff;
      border-radius: 50%;
    }
  }

  &-close {
    border-radius: 100%;

    &:hover {
      color: #fff;
      background: rgb(0 0 0 / 16%);
    }
  }
}

.tag-menu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style>

