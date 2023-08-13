<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useStore } from '@/store'

const store = useStore()
</script>

<template>
  <el-config-provider :size="store.state.app.size">
    <router-view />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>

