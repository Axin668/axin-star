<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="flex">
      <hamburger
        :is-active="store.getters['app/sidebar'].opened"
        @toggle-click="toggleSideBar"
      />
    </div>
    <breadcrumb />

    <!-- 右侧导航设置 -->
    <div class="flex">
      <!-- 导航栏设置(窄屏隐藏) -->
      <div
        v-if="device !== 'mobile'"
        class="setting-container"
      >
        <!-- 全屏 -->
        <div class="setting-item">
          <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
          ></svg-icon>
        </div>
        <!-- 布局大小 -->
        <el-tooltip
          content="布局大小"
          effect="dard"
          placement="bottom"
        >
          <size-select class="setting-item" />
        </el-tooltip>
        <!-- 语言选择 -->
        <lang-select class="setting-item" />
      </div>

      <!-- 用户头像 -->
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <img :src="store.state.user.avatar + '?imageView2/1/w/80/h/80'" />
          <i-ep-caret-bottom class="w-3 h-3" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>dashboard</el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/youlaitech/vue3-element-admin"
            >
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://gitee.com/haoxr"
            >
              <el-dropdown-item>gitee</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://juejin.cn/post/7228990409909108793"
            >
              <el-dropdown-item>document</el-dropdown-item>
            </a>
            <el-dropdown-item
              divided
              @click="logout"
            >
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const route = useRoute()
const router = useRouter()

const device = store.state.app.device

/**
 * 左侧菜单栏显示/隐藏
 */
function toggleSideBar() {
  console.log(22222222)
  store.dispatch('app/toggleSidebar', true)
}

/**
 * vueUse全屏
 */
const { isFullscreen, toggle } = useFullscreen()

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm('确认退出系统?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store
      .dispatch('user/logout')
      .then(() => {
        store.dispatch('tags_view/delAllViews')
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 1px #0003;

  .setting-container {
    display: flex;
    align-items: center;

    .setting-item {
      display: inline-block;
      width: 30px;
      height: 50px;
      line-height: 50px;
      color: #5a5e66;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: rgb(249 250 251 / 100%);
      }
    }
  }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-items: center;
    margin: 0 5px;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>

