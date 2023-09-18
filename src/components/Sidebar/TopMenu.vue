<script lang="ts" setup>
import { useStore } from '@/store'
import variables from '@/styles/variables.module.scss'
import { useRouter } from 'vue-router'
const store = useStore()
const activePath = computed(() => store.state.app.activeTopMenu)
const router = useRouter()
// 递归跳转
const goFirst = (menu: any[]) => {
  if (!menu.length) return
  const [first] = menu
  if (first.children) {
    goFirst(first.children)
  } else {
    router.push({
      name: first.name
    })
  }
}
const selectMenu = (index: string) => {
  store.commit('app/changeTopActive', index)
  store.commit('permission/getMixLeftMenu', index)
  const { mixLeftMenu } = store.state.permission
  goFirst(mixLeftMenu)
}

const topMenu = ref<any[]>([])
onMounted(() => {
  topMenu.value = store.state.permission.routes.filter(
    (item) => !item.meta || !item.meta.hidden
  )
})
</script>
<template>
  <el-scrollbar>
    <el-menu
      mode="horizontal"
      :default-active="activePath"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      @select="selectMenu"
    >
      <el-menu-item
        v-for="route in topMenu"
        :key="route.path"
        :index="route.path"
      >
        <template #title>
          <svg-icon
            v-if="route.meta && route.meta.icon"
            :icon-class="route.meta.icon"
          />
          <span v-if="route.path === '/'">首页</span>
          <template v-else>
            <span v-if="route.meta && route.meta.title">
              {{ route.meta.title }}
            </span>
          </template>
        </template>
      </el-menu-item>
      <!-- <sidebar-item
        v-for="route in topMenu"
        :key="route.path"
        :item="route"
        :base-path="route.path"
        :is-collapse="false"
      /> -->
    </el-menu>
  </el-scrollbar>
</template>
<style lang="scss" scoped>
.el-menu {
  height: 50px !important;
}
</style>

