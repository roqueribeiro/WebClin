import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  theme: {
    primary: "#1C67BD",
    secondary: "#E0E0E0",
    accent: "#B39DDB",
    error: "#E53935",
    warning: "#FFEE58",
    info: "#BBDEFB",
    success: "#81C784"
  },
  customProperties: true,
  iconfont: "md"
});
