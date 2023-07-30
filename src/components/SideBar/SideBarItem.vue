<template>
    <el-sub-menu v-if="props.item.children" :index="cur_path" :key="props.item.path">
        <template #title>
            <span>
                <el-icon><component :is="props.item.meta.icon" /></el-icon>
                {{ props.item.name }}
            </span>
        </template>
        <SideBarItem v-for="child in props.item.children" :key="child.path" :is-nest="true" :item="child" :base_path="cur_path + '/'" />
    </el-sub-menu>
    <el-menu-item v-else :index="cur_path" :key="'item' + props.item.path">
        <span>
            <el-icon><component :is="props.item.meta.icon"/></el-icon>
            {{ props.item.name }}
        </span>
    </el-menu-item>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps(['item', 'base_path'])
const cur_path = ref(props.base_path + props.item.path)
</script>

<style lang="scss" scoped>
</style>