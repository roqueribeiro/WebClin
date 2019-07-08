<template>
  <v-layout justify-center>
    <v-dialog v-model="modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline font-weight-light" v-text="title"></v-card-title>
        <v-card-text v-text="message"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="modal = false">Cancelar</v-btn>
          <v-btn color="primary" flat @click="requestExec()">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { bus } from "../bus";
export default {
  data: () => ({
    modal: false,
    title: "",
    message: "",
    method: "",
    path: ""
  }),
  created() {
    var vm = this;
    bus.$on("openModal", function(value) {
      vm.modal = !vm.modal;
      vm.title = value.title || vm.title;
      vm.message = value.message || vm.message;
      vm.method = value.method || vm.method;
      vm.path = value.path || vm.path;
    });
  },
  methods: {
    async requestExec() {
      if (this.method == "ROUTE") {
        this.$router.push(this.path);
      } else {
        this.modal = false;
        bus.$emit("onLoading", true);
        await this.$axios({
          method: this.method,
          url: this.path,
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          }
        })
          .then(() => {
            bus.$emit("openSnackbar", {
              color: "success",
              text: "Operação concluída com sucesso!",
              x: "null",
              y: "top"
            });
            bus.$emit("refreshPatients", true);
          })
          .catch(error => {
            bus.$emit("openSnackbar", {
              color: "error",
              text: error.message,
              x: "null",
              y: "top"
            });
          })
          .finally(() => {
            bus.$emit("onLoading", false);
          });
      }
    }
  }
};
</script>