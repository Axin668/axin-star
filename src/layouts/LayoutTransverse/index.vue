<!-- 横向布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
        <span class="logo-text">{{ title }}</span>
      </div>
      <el-menu mode="horizontal" :router="false" :default-active="activeMenu">
        <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem.children?.length" :key="subItem.path" :index="subItem.path + 'el-sub-menu'">
            <template #title>
              <el-icon>
                <component :is="subItem.icon"></component>
              </el-icon>
              <span>{{ subItem.name }}</span>
            </template>
            <SubMenu :menu-list="subItem.children" />
          </el-sub-menu>
          <el-menu-item v-else :key="subItem.path + 'el-menu-item'" :index="subItem.path" @click="handleClickMenu(subItem)">
            <el-icon>
              <component :is="subItem.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ subItem.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<script setup lang="ts" name="layoutTransverse">
import { computed } from "vue";
import { usePermissionStore } from "@/stores/modules/permission";
import { useRoute, useRouter } from "vue-router";
import Main from "@/layouts/components/Main/index.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { MenuVO } from "@/api/menu/types";

const title = import.meta.env.VITE_GLOB_APP_TITLE;

const route = useRoute();
const router = useRouter();
const permissionStore = usePermissionStore();
const menuList = computed(() => permissionStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);

const handleClickMenu = (subItem: MenuVO) => {
  // if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  // router.push(subItem.path);
  router.push(subItem.path);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
