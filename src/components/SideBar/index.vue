<template>
  <div
    :class="{ 'has-logo': sidebarLogo }"
    class="menu-wrap"
  >
    <logo
      v-if="sidebarLogo"
      :collapse="!store.getters['app/sidebar'].opened"
    />
    <el-scrollbar v-if="showContent">
      <el-menu
        :default-active="layout === 'top' ? '-' : currentRoute.path"
        :collapse="!store.getters['app/sidebar'].opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        :mode="layout === 'top' ? 'horizontal' : 'vertical'"
      >
        <sidebar-item
          v-for="route in store.state.permission.routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="!store.getters['app/sidebar'].opened"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import SidebarItem from './SideBarItem.vue'
import Logo from './Logo.vue'

import { useStore } from '@/store'
import { toRefs } from 'vue'
import variables from '@/styles/variables.module.scss'

const store = useStore()
const currentRoute = useRoute()
const { sidebarLogo } = toRefs(store.state.settings)
const layout = computed(() => store.state.settings.layout)
console.log(store.getters['user/isLogin'])
const showContent = ref(true)
watch(
  () => layout.value,
  () => {
    showContent.value = false
    nextTick(() => {
      showContent.value = true
    })
  }
)
</script>
<style lang="scss" scoped>
:deep(.setting-container) {
  .setting-item {
    color: #fff;
    .svg-icon {
      margin-right: 0px;
    }
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>

