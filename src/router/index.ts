import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import clientRouter from "./clientRouter";
import manageRouter from "./manageRouter";

const routes: Array<RouteRecordRaw> = [
  //管理端
  manageRouter,
  //客户端
  clientRouter,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}
