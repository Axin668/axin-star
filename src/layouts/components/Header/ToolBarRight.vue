<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="manager-name">{{ managerName }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useManagerStore } from "@/stores/modules/manager";
import AssemblySize from "./components/AssemblySize.vue";
import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";

const managerStore = useManagerStore();
const managerName = computed(() => managerStore.manager.managerName);
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .manager-name {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
