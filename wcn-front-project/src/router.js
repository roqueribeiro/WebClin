import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);
store.dispatch("tryAutoLogin");

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter() {
        store.dispatch("logout");
      }
    },
    {
      path: "/",
      async beforeEnter(to, from, next) {
        if (store.state.token) {
          await store.dispatch("fetchUser").then(() => {
            next();
          });
        } else {
          next("/login");
        }
      },
      component: () => import("./Restricted.vue"),
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("./views/Home.vue")
        },
        {
          path: "/appointment/:id",
          name: "appointment",
          component: () => import("./views/Appointment.vue")
        },
        {
          path: "/reports",
          name: "reports"
        },
        {
          path: "/configurations",
          name: "configurations"
        }
      ]
    }
  ]
});
