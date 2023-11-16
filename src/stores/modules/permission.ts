import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { constantRoutes } from "@/router";
import { store } from "@/stores";
import { listRoutes, listMenus } from "@/api/menu";
import { MenuVO } from "@/api/menu/types";
import { getAllBreadcrumbList, getFlatMenuList, getShowMenuList } from "@/utils";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layouts/index.vue");

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 角色【超级管理员】拥有所有权限，忽略校验
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    const tmpRoute = { ...route }; // ES6扩展运算符复制新对象
    if (!route.name) {
      tmpRoute.name = route.path;
    }
    // 判断管理员(角色)是否有该路由的访问权限
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() == "Layout") {
        tmpRoute.component = Layout;
      } else {
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }

      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
      }

      asyncRoutes.push(tmpRoute);
    }
  });

  return asyncRoutes;
};

// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);
  // 菜单权限列表
  const authMenuList = ref<MenuVO[]>([]);
  // 按钮权限列表
  const authButtonList = ref<{
    [key: string]: string[];
  }>({})
  // 当前页面的 router name, 用来做按钮权限筛选
  const routeName = ref<string>("");

  const authButtonListGet = () => authButtonList.value;
  const authMenuListGet = () => authMenuList.value;
  const showMenuListGet = () => getShowMenuList(authMenuList.value)
  const flatMenuListGet = () => getFlatMenuList(authMenuList.value);
  const breadcrumbListGet = () => getAllBreadcrumbList(authMenuList.value)

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }
  function setMenus(newMenus: MenuVO[]) {
    authMenuList.value = newMenus;
  }
  function setRouteName(name: string) {
    routeName.value = name;
  }

  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      listRoutes()
        .then(({ data: asyncRoutes }) => {
          // 根据角色获取有访问权限的路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
          console.log(accessedRoutes)
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 生成动态菜单
   * 
   * @param menus 用户菜单集合
   * @returns
   */
  function generateAuthMenus() {
    return new Promise<MenuVO[]>((resolve, reject) => {
      // 接口获取权限菜单
      listMenus({})
        .then(({ data: newAuthMenuList }) => {
          setMenus(newAuthMenuList);
          resolve(newAuthMenuList)
        })
        .catch((error) => {
          reject(error);
        })
    })
  }

  /**
   * 混合模式左侧菜单
   */
  const mixLeftMenu = ref<RouteRecordRaw[]>([]);
  function getMixLeftMenu(activeTop: string) {
    routes.value.forEach((item) => {
      if (item.path === activeTop) {
        mixLeftMenu.value = item.children || [];
      }
    });
  }
  return { routes, authMenuList, routeName, mixLeftMenu, // state
            authButtonListGet, authMenuListGet, showMenuListGet, flatMenuListGet, breadcrumbListGet, // getters
            setRoutes, generateRoutes, setMenus, generateAuthMenus, setRouteName, getMixLeftMenu // actions
          };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
