<template>
  <v-content>
    <v-container fluid class="ma-0 pa-0" v-for="(user, i) in this.$store.state.details" :key="i">
      <v-toolbar color="grey lighten-4 elevation-1 py-2">
        <v-flex hidden-xs-only sm8 md8>
          <v-toolbar-title style="width: 250px" class="ml-0 pl-0 font-weight-light">
            <span>
              <v-icon class="mr-3">face</v-icon>Pacientes
            </span>
          </v-toolbar-title>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-text-field
            v-model="search"
            type="text"
            append-icon="search"
            label="Buscar paciente..."
            data-vv-name="name"
            required
            solo
            hide-details
          ></v-text-field>
        </v-flex>
      </v-toolbar>
      <v-data-table :headers="headers" :items="items" flat hide-actions>
        <template slot="items" slot-scope="props">
          <td class="justify-left px-3">
            <v-menu transition="slide-y-transition" bottom right offset-x>
              <v-btn slot="activator" flat icon>
                <v-icon small>more_vert</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-tile @click="addAppointment(props.item)" v-show="user.type==2" avatar>
                  <v-list-tile-avatar>
                    <v-icon color="success">add_circle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-title>Iniciar Atendimento</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  @click="addToWaitingList({ patient: props.item.id, clinic: user.clinicCode, user: user.code, fullname: props.item.fullname })"
                  :disabled="waitingList.filter(item => item.patientCode === props.item.id).length > 0"
                  avatar
                >
                  <v-list-tile-avatar>
                    <v-icon color="primary">schedule</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-title>Adicionar na lista de espera</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  @click.prevent="openDialogNewPatient({ userCode: props.item.id })"
                  avatar
                >
                  <v-list-tile-avatar>
                    <v-icon>edit</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-title>Editar cadastro</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  @click.prevent="openModal({ name: props.item.fullname, path: `/patients/${props.item.id}`, method: 'DELETE'})"
                  avatar
                >
                  <v-list-tile-avatar>
                    <v-icon color="error">remove_circle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-title>Excluir Paciente</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
          <td>
            <transition name="rubberBand">
              <v-icon
                v-if="waitingList.filter(item => item.patientCode === props.item.id).length > 0"
                color="primary"
                class="animated mr-2"
                small
              >schedule</v-icon>
            </transition>
            {{ props.item.fullname }}
          </td>
          <td>
            <code
              color="grey lighten-5"
              class="mr-3 blue--text elevation-0"
            >{{ props.item.totalAppointments }}</code>
          </td>
          <td>{{ props.item.agreement }}</td>
          <td>{{ props.item.cpf }}</td>
        </template>
        <template slot="no-data">
          <v-alert
            :value="true"
            icon="info"
            color="info"
            class="mt-4 mb-4"
          >Nenhum registro encontrado</v-alert>
        </template>
      </v-data-table>
      <div v-show="items.length>0" class="text-xs-center pa-3 pb-5 mb-5">
        <v-pagination
          :disabled="loading"
          v-model="page"
          :length="pagination.pages"
          :total-visible="5"
        ></v-pagination>
      </div>
    </v-container>
    <v-btn @click.prevent="openDialogNewPatient()" fab bottom right color="green" dark fixed>
      <v-icon>add</v-icon>
    </v-btn>
  </v-content>
</template>

<script>
import { bus } from "../bus";
export default {
  data: () => ({
    loading: false,
    page: 1,
    search: "",
    headers: [
      {
        width: "1%",
        align: "center",
        text: "Ações",
        value: "id",
        sortable: false
      },
      { width: "500px", align: "left", text: "Nome", value: "fullname" },
      {
        width: "1%",
        align: "left",
        text: "N. Consultas",
        value: "totalAppointments"
      },
      { width: "200px", align: "left", text: "Convênio", value: "agreement" },
      { align: "left", text: "CPF", value: "cpf" }
    ],
    items: [],
    pagination: [],
    typingTimer: null,
    waitingList: []
  }),
  watch: {
    async page(newPage) {
      await this.getDataFromApi(this.search, newPage - 1);
    },
    async search(newSearch) {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(async () => {
        this.page = 1;
        await this.getDataFromApi(newSearch, 0);
      }, 1000);
    }
  },
  created() {
    var vm = this;
    bus.$on("refreshPatients", () => {
      vm.getDataFromApi(vm.search, vm.page - 1);
    });
  },
  mounted() {
    this.$socket.emit("LOAD_WAITING_LIST");
    this.sockets.subscribe("WAITING_LIST", data => {
      this.waitingList = data.filter(
        item => item.clinicCode === this.$store.state.details[0].clinicCode
      );
    });
    this.getDataFromApi();
  },
  methods: {
    addAppointment(data) {
      const tempWaitingList = this.waitingList.filter(
        item => item.patientCode === data.id
      );
      this.$router.push(`/appointment/${data.id}`);
      if (tempWaitingList[0]) {
        this.removeFromWaitingList({
          waitingCode: tempWaitingList[0].waitingCode,
          user: this.$store.state.details[0].code
        });
      }
    },
    addToWaitingList(data) {
      this.$socket.emit("ADD_TO_WAITING_LIST", data);
    },
    removeFromWaitingList(data) {
      this.$socket.emit("REMOVE_FROM_WAITING_LIST", data);
    },
    openModal(params) {
      bus.$emit("openModal", {
        title: "Excluir",
        message: `Você realmente deseja excluir o paciente ${params.name}?`,
        method: params.method,
        path: params.path
      });
    },
    openDialogNewPatient(params) {
      bus.$emit("openDialogNewPatient", params);
    },
    getDataFromApi(search, page) {
      bus.$emit("onLoading", true);
      this.$axios
        .get("/patients", {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          params: {
            perPage: 30,
            currentPage: page || 0,
            searchByClinic: this.$store.state.details[0].clinicCode,
            searchByName: search || ""
          }
        })
        .then(response => {
          const results = response.data.results;
          const pagination = response.data.pagination;
          this.items = results.map(item => ({
            id: item.code,
            agreement: item.agreement,
            fullname: item.fullname,
            cpf: item.cpf,
            totalAppointments: item.totalAppointments
          }));
          this.pagination = pagination;
        })
        .catch(() => {
          this.items = [];
        })
        .finally(() => {
          bus.$emit("onLoading", false);
        });
    }
  }
};
</script>

<style scoped>
td {
  white-space: nowrap;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.rubberBand-enter-active {
  animation-name: rubberBand;
  transform-origin: center bottom;
}

@keyframes rubberBand {
  from {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>
