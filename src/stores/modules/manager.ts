import { defineStore } from "pinia";

import { loginApi, logoutApi } from "@/api/auth";
import { getManagerInfo } from "@/api/manager";
import { resetRouter } from "@/router";
import { store } from "@/stores";

import { LoginData } from "@/api/auth/types";
import { ManagerInfo } from "@/api/manager/types";

import { useStorage } from "@vueuse/core";

export const useManagerStore = defineStore("manager", () => {
  const manager: ManagerInfo = {
    roles: [],
    perms: [],
  };

  const token = useStorage("accessToken", "");

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const { tokenType, accessToken } = response.data;
          token.value = tokenType + " " + accessToken; // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise<ManagerInfo>((resolve, reject) => {
      getManagerInfo()
        .then(({ data }) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          Object.assign(manager, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetStore();
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 清空缓存 */
  function resetStore() {
    resetRouter();
    token.value = "";
    Object.assign(manager, { roles: [], perms: [] });
  }
  return {
    token,
    manager,
    login,
    getInfo,
    logout,
    resetStore,
  };
});

// 非setup
export function useManagerStoreHook() {
  return useManagerStore(store);
}
