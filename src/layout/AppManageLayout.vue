<template>
  <div class="common-layout">
    <el-container class="container">
      <el-aside class="aside" :style="{'width':(isCollapse?'63px':'230px')}">
        <SideBar :isCollapse="isCollapse"/>
      </el-aside>
      <el-container>
        <el-header class="header">
          <el-row>
            <el-col :span="1">
              <Humburger :isCollapse="isCollapse" ref="humburger" @changeIsCollapse="changeIsCollapse"/>
            </el-col>
            <el-col :span="12">
              <Breadcrumb />
            </el-col>
          </el-row>
        </el-header>
        <el-main class="main"><router-view/></el-main>
        <el-footer class="footer">Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import SideBar from '@/components/SideBar/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Humburger from '@/components/Hamburger/index.vue'
import { ref } from 'vue'

let isCollapse = ref(false)
const humburger: any = ref(null)
const changeIsCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

    .aside {
      overflow: hidden;
      box-shadow:2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
      6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
      12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
      22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
      41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
      100px 100px 80px rgba(0, 0, 0, 0.07)
    }
    .header {
        height: 60px;
        width: 100vw;
        box-shadow:
        8.7px 9.2px 2.6px rgba(0, 0, 0, 0.023),
        18.5px 19.6px 6.3px rgba(0, 0, 0, 0.025),
        29.9px 31.7px 11.9px rgba(0, 0, 0, 0.024),
        44.2px 46.8px 21.2px rgba(0, 0, 0, 0.023),
        64.1px 67.9px 39.7px rgba(0, 0, 0, 0.028),
        100px 106px 95px rgba(0, 0, 0, 0.07)
    }

    .main {
      background-color: $bg-color;
    }

    .footer {
        background: #a1e9d2;
        height: 80px;
        width: 100vw;
    }
}
</style>