<template>
    <div>
      <div class="logo">
        <Logo :collapse="isCollapse"/>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
        :default-active="selectKey"
        @select="handleSelect"
        :collapse="props.isCollapse"
        :collapse-transition="false"
        background-color="#ebf1f5"
        text-color="#606266"
        active-text-color="#2F74FF"
        class="menu"
        :unique-opened="true"
        router
      >
          <!-- <template v-for="(first, index) in manageRouter.children">
              <el-sub-menu :index="base + first.path" v-if="first.children" :key="index">
                  <template v-if="first.children">
                      <el-menu-item-group v-for="(second, sec_index) in first.children" :key="sec_index">
                          <el-menu-item :index="base + first.path + '/' + second.path">
                              <i class="el-icon-odometer"/>
                              <el-icon><component :is="second.meta.icon"/></el-icon>
                              {{ second.name }}
                          </el-menu-item>
                      </el-menu-item-group>
                  </template>
                  <template #title>
                      <span>
                          <el-icon><component :is="first.meta.icon"/></el-icon>
                          {{ first.name }}
                      </span>
                  </template>
              </el-sub-menu>
              <el-menu-item v-else :index="base +first.path" :key="'item' + index">
                  <span>
                      <el-icon><component :is="first.meta.icon"/></el-icon>
                      {{ first.name }}
                  </span>
              </el-menu-item>
          </template> -->
          <SideBarItem v-for="route in manageRouter.children" :key="route.path" :item="route" :base_path="base"/>
        </el-menu>
      </el-scrollbar>
    </div>
</template>
  
<script lang="ts" setup name="SideBar">
import manageRouter from '@/router/manageRouter'
import { ref } from 'vue'
import Logo from './Logo.vue'
import SideBarItem from './SideBarItem.vue'
  
const props = defineProps(['isCollapse'])
const base = '/manage/'
const selectKey = ref('')
const handleSelect = (key: string) => {
  selectKey.value = key
} 

</script>
  
<style>
  .logo{
    height:80px;
    background: #e1eaf4;
  }
  .menu{
    min-height: calc(100vh - 80px);
   
  }
  .menu .el-menu-item:hover {
    background-color: #FFFFFF80;
  }
  .menu .el-menu-item.is_active {
    background-color: #FFFFFF80!important;
    color: #2f74ff!important
  }
</style>
