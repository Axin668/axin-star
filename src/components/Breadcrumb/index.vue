<template>
    <el-breadcrumb :separator-icon="ArrowRight" class="bread">
      <el-breadcrumb-item v-for="item in routers" :key="item.path" :to="{ path: item?.path }">
              {{ item?.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </template>
  
  <script lang="ts" setup name="Breadcrumb">
  import { useRouter } from "vue-router";
  import { ArrowRight } from '@element-plus/icons-vue'
  import { computed } from "vue";
  const router = useRouter()
  // 当前路由的匹配记录
  console.log(router.currentRoute.value.matched)
  const routers = computed(()=>{
      // 过滤掉没有icon的, 也就是第一级 
      return router.currentRoute.value.matched.filter(item => item.meta.icon)
  })
  </script>
  
  <style lang="scss" scoped>
  /* 这里为了跟收起图标对其 */
  .bread{
      margin-top: 8px;
  }
  </style>
  