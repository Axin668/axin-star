<template>
  <div :class="['breadcrumb-box mask-image', !globalStore.breadcrumbIcon && 'no-icon']">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          <div
            class="el-breadcrumb__inner is-link"
            :class="{ 'item-no-icon': !item.meta.icon }"
            @click="onBreadcrumbClick(item)"
          >
            <el-icon v-if="item.meta.icon && globalStore.breadcrumbIcon" class="breadcrumb-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="breadcrumb-title">{{ item.meta.title }}</span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HOME_URL } from "@/config";
import { useRoute, useRouter } from "vue-router";
import { compile } from 'path-to-regexp'
import { ArrowRight } from "@element-plus/icons-vue";
import { useGlobalStore } from "@/stores/modules/global";

const currentRoute = useRoute();
const router = useRouter();
const pathCompile = (path: string) => {
  const { params } = currentRoute
  const toPath = compile(path)
  return toPath(params)
}
const globalStore = useGlobalStore();

const breadcrumbList = computed(() => {
  let breadcrumbData = currentRoute.matched.filter((item) => 
    item.meta && item.meta.title
  )

  // 🙅‍♀️不需要首页面包屑可删除以下判断
  if (breadcrumbData[0].path !== HOME_URL) {
    // as any 做一下定义, 否则需要定义其他属性
    breadcrumbData = [{ path: HOME_URL, meta: { icon: "HomeFilled", title: "首页" } } as any, ...breadcrumbData];
  }

  // 过滤一下不需要面包屑的路由
  return breadcrumbData.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  })
});

// Click Breadcrumb
const onBreadcrumbClick = (item: any) => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    })
    return
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  })
}

// // Click Breadcrumb
// const onBreadcrumbClick = (item: Menu.MenuOptions, index: number) => {
//   if (index !== breadcrumbList.value.length - 1) router.push(item.path);
// };

</script>

<style scoped lang="scss">
.breadcrumb-box {
  display: flex;
  align-items: center;
  overflow: hidden;
  .el-breadcrumb {
    white-space: nowrap;
    .el-breadcrumb__item {
      position: relative;
      display: inline-block;
      float: none;
      .item-no-icon {
        transform: translateY(-3px);
      }
      .el-breadcrumb__inner {
        display: inline-flex;
        &.is-link {
          color: var(--el-header-text-color);
          &:hover {
            color: var(--el-color-primary);
          }
        }
        .breadcrumb-icon {
          margin-top: 1px;
          margin-right: 6px;
          font-size: 16px;
        }
        .breadcrumb-title {
          margin-top: 2px;
        }
      }
      &:last-child .el-breadcrumb__inner,
      &:last-child .el-breadcrumb__inner:hover {
        color: var(--el-header-text-color-regular);
      }
      :deep(.el-breadcrumb__separator) {
        transform: translateY(-1px);
      }
    }
  }
}
.no-icon {
  .el-breadcrumb {
    .el-breadcrumb__item {
      top: -2px;
      :deep(.el-breadcrumb__separator) {
        top: 4px;
      }
      .item-no-icon {
        transform: translateY(0);
      }
    }
  }
}
</style>
