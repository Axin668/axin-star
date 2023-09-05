<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 只包含一个子路由节点的路由, 显示其[唯一子路由] -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChild)
      "
    >
      <app-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path)"
      >
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :icon-class="onlyOneChild.meta.icon"
          />
          <template #title>
            {{ onlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <!-- 包含多个子路由 -->
    <el-sub-menu
      v-else
      :index="resolvePath(item.path)"
      teleported
    >
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        />
        <span v-if="item.meta && item.meta.title">
          {{ item.meta.title }}
        </span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import path from 'path-browserify'
import { isExternal } from '@/utils'
import AppLink from './Link.vue'

import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  /**
   * 路由(eg:level_3_1)
   */
  item: {
    type: Object,
    required: true
  },

  /**
   *  父层级完整路由路径(eg:/level/level_3/level_3_1)
   */
  basePath: {
    type: String,
    required: true
  }
})

const onlyOneChild = ref()

/**
 * 判断当前路由是否只有一个子路由
 *
 * 1：如果只有一个子路由： 返回 true
 * 2：如果无子路由 ：返回 true
 *
 * @param children 子路由数组
 * @param parent 当前路由
 */
function hasOneShowingChild(children = [], parent: any) {
  //需要显示的子路由数组
  const showingChild = children.filter((item: any) => {
    if (item.meta?.hidden) {
      return false // 过滤不显示的子路由
    } else {
      onlyOneChild.value = item // 唯一子路由赋值（多个子路由情况 onlyOneChild 变量是用不上的）
      return true
    }
  })

  if (showingChild.length === 1) {
    // 1：如果只有一个子路由, 返回 true
    return true
  }

  if (showingChild.length === 0) {
    // 2：如果无子路由, 复制当前路由信息作为其子路由，满足只拥有一个子路由的条件，所以返回 true
    onlyOneChild.value = { ...parent, path: '', noShowingChild: true }
    return true
  }
  return false
}

/**
 * 解析路径
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath)
  return fullPath
}
</script>

<style lang="scss" scoped>
:deep(.el-menu-item .el-menu-tooltip__trigger) {
  width: auto !important;
}
</style>
