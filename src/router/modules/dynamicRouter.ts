import { useManagerStoreHook } from "@/stores/modules/manager";
import { usePermissionStoreHook } from "@/stores/modules/permission";
import { ElNotification } from "element-plus";
import router from "@/router/index";
import { LOGIN_URL } from "@/config";

const modules = import.meta.glob("@/views/**/*.vue");

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
    let managerStore = useManagerStoreHook();
    let permissionStore = usePermissionStoreHook();

    try {
        // 1.获取菜单列表 && 按钮权限列表
        await permissionStore.generateAuthMenus();
        // await permissionStore.generateAuthButtons();

        // 2.判断当前管理员是否有管理员权限
        if (!permissionStore.authMenuListGet.length) {
            ElNotification({
                title: "无权限访问",
                message: "当前账号无任何菜单权限，请联系系统管理员！",
                type: "warning",
                duration: 3000
            });
            managerStore.setToken("")
            router.replace(LOGIN_URL);
            return Promise.reject("No Permission");
        }

        // 3.添加动态路由
        const { roles } = await managerStore.getInfo();
        const accessRoutes = await permissionStore.generateRoutes(roles);
        accessRoutes.forEach((route) => {
          router.addRoute(route);
        });
        // console.log("origin_routes", permissionStore.routes)
        // console.log("origin_authMenuList", permissionStore.authMenuList)
        // console.log("routeName", permissionStore.routeName);
        // console.log("get1", permissionStore.authButtonListGet)
        // console.log("get2", permissionStore.authMenuListGet)
        // console.log("get3", permissionStore.showMenuListGet);
        // console.log("get4", permissionStore.flatMenuListGet);
        // console.log("get5", permissionStore.breadcrumbListGet)
        // console.log("origin_authMenuList11111", permissionStore.authMenuList)
    } catch (error) {
        // 当按钮 || 菜单请求出错时, 重定向到登录页
        managerStore.setToken("");
        router.replace(LOGIN_URL);
        console.log("initError")
        return Promise.reject(error);
    }
};