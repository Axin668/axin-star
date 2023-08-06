<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <logo
      v-if="sidebarLogo"
      :collapse="!store.getters.sidebar.opened"
    />
    <el-scrollbar>
      <el-menu
        :default-active="currentRoute.path"
        :collapse="!store.getters.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in store.state.permission.routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="!store.getters.sidebar.opened"
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
</script>

