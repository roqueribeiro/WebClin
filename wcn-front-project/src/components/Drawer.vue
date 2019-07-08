<template>
  <v-navigation-drawer v-model="drawer" :mini-variant="mini" overflow fixed app>
    <v-list class="pt-0" v-for="(user, i) in this.$store.state.details" :key="i">
      <v-toolbar color="primary" flat dark>
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-avatar color="white">
                <v-icon color="primary">account_circle</v-icon>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="user.fullname"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <template v-for="item in items">
        <v-layout v-if="item.heading" :key="item.heading" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-center">
            <a href="#!" class="body-2 black--text">EDIT</a>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="(child, i) in item.children"
            :key="i"
            @click.stop="routeTo(item.children.to)"
          >
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile
          v-else
          :key="item.text"
          @click.stop="routeTo(item.to)"
          v-show="user.level>=item.level"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <v-list-tile v-if="mini" @click.stop="mini = !mini" style="position: absolute; bottom: 0;">
        <v-list-tile-action>
          <v-icon>chevron_right</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { bus } from "../bus";
export default {
  data: () => ({
    drawer: true,
    mini: true,
    items: [
      { icon: "face", text: "Pacientes", level: 1, to: "/" },
      { icon: "exit_to_app", text: "Sair", level: 1, to: "/logout" }
    ]
  }),
  created() {
    if (this.$vuetify.breakpoint.name == "xs") this.drawer = false;
    if (this.$vuetify.breakpoint.name == "sm") this.drawer = false;
    var vm = this;
    bus.$on("openDrawer", function() {
      vm.drawer = !vm.drawer;
    });
  },
  methods: {
    routeTo(path) {
      if (this.$vuetify.breakpoint.name == "xs") this.drawer = false;
      if (this.$vuetify.breakpoint.name == "sm") this.drawer = false;
      if (path == "/logout") {
        bus.$emit("openModal", {
          title: "Desconectar",
          message: "Você realmente deseja sair?",
          method: "ROUTE",
          path: path
        });
      } else this.$router.push(path);
    }
  }
};
</script>
