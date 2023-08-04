import { RootState, Commit } from "vuex";
import { loginApi, logoutApi } from "@/api/auth";
import { getUserInfo } from "@/api/user";
import { resetRouter } from "@/router";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types";

interface UserState {
  userId: number;
  token: string;
  nickname: string;
  avatar: string;
  roles: string[];
  perms: string[];
}

const state = {
  userId: -1,
  token: "",
  nickname: "",
  avatar: "",
  roles: [],
  perms: [],
};

const mutations = {
  setUser(state: State, user: UserInfo) {
    Object.assign(state, user);
  },
  resetUser(state: State) {
    state.token = "";
    state.nickname = "";
    state.avatar = "";
    state.roles = [];
    state.perms = [];
  },
};

const actions = {
  login({ commit }: { commit: Commit }, loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const { tokenType, accessToken } = response.data;
          const token = tokenType + " " + accessToken;
          commit("setUser", { token });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getInfo({ commit }: { commit: Commit }) {
    try {
      const { data } = await getUserInfo();
      if (!data) {
        throw "Verification failed, please Login again.";
      }
      if (!data.roles || data.roles.length < 0) {
        throw "getUserInfo: roles must be a non-null array!";
      }
      commit("setUser", {
        userId: data.userId,
        nickname: data.nickname,
        avatar: data.avatar,
        roles: data.roles,
        perms: data.perms,
      });
    } catch (error) {
      throw error;
    }
  },
  async logout({ commit }: { commit: Commit }) {
    try {
      await logoutApi();
      resetRouter();
      commit("resetUser");
      location.reload();
    } catch (error) {
      throw error;
    }
  },
};

const getters = {
  isLogin(state) {
    return !!state.token;
  },
  hasRole(state) {
    return (role: string) => {
      return state.roles.includes(role);
    };
  },
  hasPermission: (state) => (perm: string) => state.perms.includes(perm),
};

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters,
};
