import api from "@/request/api";
import axios from "@/request";
import { defineStore } from "pinia";
import router from "@/router";

const defaultState = () => {
  return {
    userInfo: null
  }
}

export const useUserStore = defineStore("user", {
  state: () => defaultState(),

  getters: {},

  actions: {
    async getUserInfo() {
  
    },

    updateUserInfo(payload) {
      Object.assign(this.userInfo, payload)
    },

    logout() {
      localStorage.removeItem("accessToken");
      this.$reset();
      router.push("/login")
    },

    $reset() {
      Object.assign(this, defaultState());
    },
  },
});
