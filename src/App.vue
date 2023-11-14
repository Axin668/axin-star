<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore();
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>

