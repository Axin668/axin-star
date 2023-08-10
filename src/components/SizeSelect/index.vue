<template>
  <el-dropdown
    trigger="click"
    @command="handleSizeChange"
  >
    <div>
      <svg-icon icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="store.state.app.size.value == item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'

const store = useStore()

const sizeOptions = ref([
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' }
])

function handleSizeChange(size: string) {
  store.commit('app/changeSize', size)
  ElMessage.success('切换布局大小成功')
}
</script>

