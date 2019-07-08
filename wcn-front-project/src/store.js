import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import axios from "axios";
import { bus } from "./bus";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    details: null
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token;
      state.user = userData.user;
    },
    storeUser(state, details) {
      state.details = details;
    },
    clearAuthData(state) {
      state.token = null;
      state.user = null;
    }
  },
  actions: {
    setLogoutTimer({ dispatch }, expirationTime) {
      setTimeout(() => {
        bus.$emit("openSnackbar", {
          color: "error",
          text: "Seu tempo de sessão expirou! Autentique novamente.",
          x: "null",
          y: "top"
        });
        dispatch("logout");
      }, expirationTime * 1000);
    },
    async login({ commit, dispatch }, authData) {
      bus.$emit("onLoading", true);
      return await axios
        .post("/authentication", {
          username: authData.username,
          password: authData.password
        })
        .then(res => {
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.user);
          localStorage.setItem("expirationDate", expirationDate);
          commit("authUser", {
            token: res.data.token,
            user: res.data.user
          });
          router.replace("/");
          dispatch("setLogoutTimer", res.data.expiresIn);
        })
        .catch(error => {
          if (error.response.status == 401) {
            bus.$emit("openSnackbar", {
              color: "error",
              text: "Usuário ou senha inválido.",
              x: "null",
              y: "top"
            });
          } else {
            bus.$emit("openSnackbar", {
              color: "error",
              text: error.message,
              x: "null",
              y: "top"
            });
          }
        })
        .finally(() => {
          bus.$emit("onLoading", false);
        });
    },
    async fetchUser({ commit, state }) {
      if (!state.token) {
        return;
      }
      return await axios
        .get(`/users/${state.user}`, {
          responseType: "json",
          headers: {
            Authorization: state.token
          }
        })
        .then(res => {
          commit("storeUser", res.data.results);
        })
        .catch(error => console.log(error));
    },
    tryAutoLogin({ commit }) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      const now = new Date();
      if (now >= expirationDate) {
        return;
      }
      const user = localStorage.getItem("user");
      commit("authUser", {
        token: token,
        user: user
      });
    },
    logout({ commit }) {
      commit("clearAuthData");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expirationDate");
      router.replace("/login");
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.token !== null;
    }
  }
});
