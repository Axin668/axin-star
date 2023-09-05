<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { AppMain, Navbar, Settings, TagsView } from './components/index'
import RightPanel from '@/components/RightPanel/index.vue'

import { useStore } from '@/store'
const { width } = useWindowSize()

/**
 * 响应式布局容器固定宽度
 *
 * 大屏（>=1200px）
 * 中屏（>=992px）
 * 小屏（>=768px）
 */
const WIDTH = 992

const store = useStore()

const fixedHeader = computed(() => store.state.settings.fixedHeader)
const showTagsView = computed(() => store.state.settings.tagView)
const showSettings = computed(() => store.state.settings.showSettings)
const layout = computed(() => store.state.settings.layout)

watchEffect(() => {
  if (width.value < WIDTH) {
    store.commit('app/toggleDevice', 'mobile')
    // store.dispatch('app/closeSidebar', true)
  } else {
    store.commit('app/toggleDevice', 'desktop')

    if (width.value >= 1200) {
      //大屏
      // store.dispatch('app/openSidebar', true)
    } else {
      // store.dispatch('app/closeSidebar', true)
    }
  }
})
</script>
<template>
  <div
    :class="{ hasTagsView: showTagsView }"
    class="main-container"
  >
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar v-if="layout === 'left'" />
      <tags-view v-if="showTagsView" />
    </div>
    <!--主页面-->
    <app-main />
    <!-- 设置面板 -->
    <RightPanel v-if="showSettings">
      <settings />
    </RightPanel>
  </div>
</template>

<style lang="scss" scoped>
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

.isTop .fixed-header {
  width: 100% !important;
}

.isMix,
.isTop {
  .fixed-header {
    top: 50px;
  }
}
</style>

