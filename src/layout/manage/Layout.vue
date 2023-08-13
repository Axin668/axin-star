<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <!-- 手机设备侧边栏打开遮罩层 -->
    <div
      v-if="classObj.mobile && classObj.openSidebar"
      class="drawer-bg"
      @click="handleOutsideClick"
    ></div>

    <SideBar class="sidebar-container" />

    <div
      :class="{ hasTagsView: showTagsView }"
      class="main-container"
    >
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar v-if="layout !== 'top'" />
        <tags-view v-if="showTagsView" />
      </div>

      <!-- 主页面 -->
      <app-main />

      <!-- 设置面板 -->
      <RightPanel v-if="showSettings">
        <settings />
      </RightPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { AppMain, Navbar, Settings, TagsView } from './components'
import SideBar from '@/components/SideBar/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'

import { useStore } from '@/store'

const { width } = useWindowSize()

/**
 * 响应式布局容器固定宽度
 *
 * 大屏(>= 1200px)
 * 中屏(>= 992px)
 * 小屏(>= 768px)
 */
const WIDTH = 992

const store = useStore()

const fixedHeader = computed(() => store.state.settings.fixedHeader)
const showTagsView = computed(() => store.state.settings.tagView)
const showSettings = computed(() => store.state.settings.showSettings)
const layout = computed(() => store.state.settings.layout)

const classObj = computed(() => ({
  hideSidebar: !store.getters['app/sidebar'].opened,
  openSidebar: store.getters['app/sidebar'].opened,
  withoutAnimation: store.getters['app/sidebar'].withoutAnimation,
  mobile: store.state.app.device === 'mobile',
  isTop: layout.value === 'top'
}))

watchEffect(() => {
  if (width.value < WIDTH) {
    store.commit('app/toggleDevice', 'mobile')
    // store.dispatch('app/closeSidebar', true)
  } else {
    store.commit('app/toggleDevice', 'desktop')

    if (width.value >= 1200) {
      // 大屏
      // store.dispatch('app/openSidebar', true)
    } else {
      // store.dispatch('app/closeSidebar', true)
    }
  }
})

function handleOutsideClick() {
  store.dispatch('app/closeSidebar', false)
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.drawer-bg {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}
// 导航栏顶部显示
.isTop {
  .sidebar-container {
    z-index: 800;
    display: flex;
    width: 100% !important;
    height: 50px;

    :deep(.logo-wrap) {
      width: 210px;
    }

    :deep(.el-scrollbar) {
      flex: 1;
      min-width: 0;
      height: 50px;
    }
  }

  .main-container {
    padding-top: 50px;
    margin-left: 0;
  }

  // 顶部模式全局变量修改
  --el-menu-item-height: 50px;
}
</style>

