<template>
  <v-navigation-drawer v-model="drawerWaitingList" width="500px" temporary right overflow fixed app>
    <v-list class="pt-0" v-for="(user, i) in this.$store.state.details" :key="i">
      <v-toolbar color="primary" flat dark>
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-avatar>
                <v-badge overlap color="red">
                  <span slot="badge" v-text="waitingList.length"></span>
                  <v-icon color="white">face</v-icon>
                </v-badge>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Pacientes em espera</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.stop="drawerWaitingList = !drawerWaitingList">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <template v-for="(patient, i) in waitingList">
        <v-list-tile class="py-2" :key="patient.waitingCode">
          <v-list-tile-action v-show="user.level>1">
            <v-tooltip left>
              <v-btn
                slot="activator"
                color="green darken-2"
                dark
                @click.stop="addAppointment(patient)"
                flat
                icon
                class="ma-0"
              >
                <v-icon>add_circle</v-icon>
              </v-btn>
              <span>Atender o paciente</span>
            </v-tooltip>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="patient.patientFullname"></v-list-tile-title>
            <v-list-tile-sub-title v-text="getWaitingListTime(patient.waitingDate)"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip left>
              <v-btn
                slot="activator"
                color="red darken-2"
                dark
                @click.stop="removeFromWaitingList({ waitingCode: patient.waitingCode, user: user.code })"
                flat
                icon
                class="ma-0"
              >
                <v-icon small>delete</v-icon>
              </v-btn>
              <span>Remover da lista de espera</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="i + 1 < waitingList.length" :key="i"></v-divider>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { bus } from "../bus";
import moment from "moment";

export default {
  data: () => ({
    waitingList: [],
    drawerWaitingList: false
  }),
  created() {
    var vm = this;
    bus.$on("openDrawerWaitingList", () => {
      vm.drawerWaitingList = !vm.drawerWaitingList;
    });
  },
  mounted() {
    this.sockets.subscribe("WAITING_LIST", data => {
      this.waitingList = data.filter(
        item => item.clinicCode === this.$store.state.details[0].clinicCode
      );
    });
  },
  methods: {
    getWaitingListTime: function(date) {
      return moment(date)
        .locale("pt-br")
        .startOf("minutes")
        .fromNow();
    },
    addAppointment(data) {
      this.$router.push(`/appointment/${data.patientCode}`);
      this.removeFromWaitingList({
        waitingCode: data.waitingCode,
        user: this.$store.state.details[0].code
      });
    },
    removeFromWaitingList(data) {
      this.$socket.emit("REMOVE_FROM_WAITING_LIST", data);
    }
  }
};
</script>
