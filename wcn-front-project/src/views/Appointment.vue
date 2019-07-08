<template>
  <v-content>
    <v-container fluid class="ma-0 pa-0" v-for="(details, i) in patient" :key="i">
      <v-toolbar color="grey lighten-4 elevation-1">
        <v-flex>
          <v-toolbar-title class="ml-0 pl-0 font-weight-light">
            <span>
              <v-icon class="mr-3">add_circle</v-icon>
              Atendimento: {{details.fullname}}
            </span>
          </v-toolbar-title>
        </v-flex>
      </v-toolbar>
      <v-container grid-list-md text-xs-center fluid class="pa-2">
        <v-layout row wrap>
          <v-flex xs12 sm8 md6 class="mb-4">
            <v-tabs centered color="primary" class="elevation-1" dark icons-and-text>
              <v-tabs-slider dark></v-tabs-slider>
              <v-tab href="#tab-1">Formulário de Atendimento
                <v-icon>add_circle</v-icon>
              </v-tab>
              <v-tab href="#tab-2">Dados do Paciente
                <v-icon>face</v-icon>
              </v-tab>
              <v-tab-item value="tab-1">
                <v-card flat>
                  <v-card-text>
                    <form>
                      <v-flex xs12 md12>
                        <v-select
                          v-model="appointmentType"
                          :items="appointmentTypeItems"
                          item-text="value"
                          item-value="code"
                          label="Tipo"
                          required
                          @change="$v.appointmentType.$touch()"
                          @blur="$v.appointmentType.$touch()"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-autocomplete
                          v-model="cid"
                          :items="cids"
                          item-text="value"
                          item-value="code"
                          :search-input.sync="searchCid"
                          :loading="loadingField"
                          label="CID"
                          required
                          @input="$v.cid.$touch()"
                          @blur="$v.cid.$touch()"
                          chips
                          multiple
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              class="chip--select-multi"
                              @input="removeCid(data.item)"
                            >{{ data.item.code }}</v-chip>
                          </template>
                        </v-autocomplete>
                      </v-flex>
                      <v-flex xs12 md12>
                        <Editor
                          v-model="description"
                          @onChange="$v.description.$touch()"
                          @onBlur="$v.description.$touch()"
                          required
                          api-key="wtklxmtkit21hyq7pfhnj6mbxr67dlllu27sjn5xrlpm2ouh"
                          :init="{
                            height: 240,
                            menubar: false,
                            plugins: [
                              'advlist autolink lists link image charmap print preview anchor textcolor',
                              'searchreplace visualblocks fullscreen',
                              'insertdatetime media table contextmenu paste imagetools'
                            ],
                            toolbar: 'insert | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify bullist numlist removeformat fullscreen'
                          }"
                        ></Editor>
                      </v-flex>
                    </form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      @click="submit"
                      :disabled="$v.$invalid || loading"
                      color="primary"
                      block
                      flat
                    >Salvar Consulta</v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card flat>
                  <v-card-text class="ma-0 pa-0 text-sm-left text-xs-left patient-details">
                    <p v-html="`<strong>Convênio:</strong>${details.agreement}`"></p>
                    <p v-html="`<strong>Nome:</strong>${details.fullname}`"></p>
                    <p v-html="`<strong>CPF:</strong>${details.cpf}`"></p>
                    <p v-html="`<strong>RG:</strong>${details.rg}`"></p>
                    <p v-html="`<strong>D. Nascimento:</strong>${details.birthDate}`"></p>
                    <p v-html="`<strong>Idade:</strong>${details.age}`"></p>
                    <p v-html="`<strong>Telefone:</strong><a href='tel:${details.housePhone}'>${details.housePhone}</a>`"></p>
                    <p v-html="`<strong>Celular:</strong><a href='tel:${details.mobilePhone}'>${details.mobilePhone}</a>`"></p>
                    <p v-html="`<strong>CEP:</strong>${details.zipcode}`"></p>
                    <p v-html="`<strong>N. Residencial:</strong>${details.houseNumber}`"></p>
                    <p v-html="`<strong>Bairro:</strong>${details.district}`"></p>
                    <p v-html="`<strong>Cidade:</strong>${details.city}`"></p>
                    <p v-html="`<strong>Estado:</strong>${details.state}`"></p>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-flex>
          <v-flex xs12 sm4 md6>
            <v-toolbar dark color="primary" dense flat>
              <v-icon>folder_shared</v-icon>
              <v-toolbar-title>Consultas Anteriores</v-toolbar-title>
            </v-toolbar>
            <v-text-field
              v-model="searchByDescription"
              label="Pesquisar..."
              prepend-inner-icon="search"
              class="mt-3 mb-3 px-4"
            ></v-text-field>
            <v-timeline dense class="ml-3 timeline-appointments">
              <v-timeline-item v-for="(item, i) in appointments" :key="i" left small>
                <v-card class="elevation-1 mt-2">
                  <v-card-text
                    class="text-sm-left ma-0"
                    v-html="`Tipo: ${appointmentTypeItems.filter(n => n.code === item.type)[0].value}`"
                  ></v-card-text>
                  <v-divider light></v-divider>
                  <v-card-text class="text-sm-left ma-0 item-description" v-html="item.description"></v-card-text>
                  <v-divider light></v-divider>
                  <v-card-text class="text-sm-left ma-0 item-cid" v-html="`CID: ${item.cid}`"></v-card-text>
                  <v-divider light></v-divider>
                  <v-card-text
                    class="text-sm-left font-weight-light"
                    v-if="item.creationUser!=undefined"
                    v-html="`${item.creationDate} - ${item.creationUser} (${item.clinic})`"
                  ></v-card-text>
                </v-card>
              </v-timeline-item>
              <v-timeline-item v-if="appointments.length<=0">
                <v-card class="elevation-1 mt-2">
                  <v-card-text
                    class="text-sm-left ma-0"
                  >Este paciente não possuí consultas anteriores.</v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            <div v-show="appointments.length>0" class="text-xs-center pa-3">
              <v-pagination
                :disabled="loading"
                v-model="page"
                :length="pagination.pages"
                :total-visible="5"
              ></v-pagination>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
  </v-content>
</template>

<script>
import { bus } from "../bus";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import moment from "moment";
import Editor from "@tinymce/tinymce-vue";

export default {
  components: {
    Editor
  },
  mixins: [validationMixin],
  validations: {
    appointmentType: { required },
    cid: { required },
    description: { required }
  },
  data: () => ({
    userCode: 0,
    loading: false,
    loadingField: false,
    appointmentType: 1,
    appointmentTypeItems: [
      { code: 1, value: "Consulta" },
      { code: 2, value: "Retorno" }
    ],
    cid: [],
    cids: [],
    searchByDescription: "",
    searchCid: null,
    description: "",
    page: 1,
    patient: [],
    appointments: [],
    pagination: [],
    typingTimer: null
  }),
  watch: {
    async page(newPage) {
      await this.getAppointmentsFromApi(this.searchByDescription, newPage - 1);
    },
    async searchByDescription(newSearch) {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(async () => {
        this.page = 1;
        await this.getAppointmentsFromApi(newSearch, 0);
      }, 1000);
    },
    async searchCid() {
      if (this.cids.length > 0) return;
      if (this.loadingField) return;
      await this.getCidFromApi();
    }
  },
  created() {
    var vm = this;
    bus.$on("onLoading", function(value) {
      vm.loading = value;
    });
  },
  mounted() {
    this.getDataToScreen();
  },
  methods: {
    getDataToScreen() {
      this.userCode = this.$route.params.id;
      this.getCidFromApi();
      this.getPatientFromApi();
      this.getAppointmentsFromApi();
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        bus.$emit("onLoading", true);
        const params = new URLSearchParams();
        params.append("type", parseInt(this.appointmentType, 10));
        params.append("cid", this.cid.join(", ").toString());
        params.append("description", this.description.trim());
        params.append("patient", parseInt(this.userCode, 10));
        params.append(
          "creationUser",
          parseInt(this.$store.state.details[0].code, 10)
        );
        params.append(
          "clinic",
          parseInt(this.$store.state.details[0].clinicCode, 10)
        );
        this.$axios
          .post("/appointments", params, {
            responseType: "json",
            headers: {
              Authorization: this.$store.state.token
            }
          })
          .then(() => {
            bus.$emit("openSnackbar", {
              color: "success",
              text: "Consulta registrada com sucesso!",
              x: "null",
              y: "top"
            });
            this.getAppointmentsFromApi();
          })
          .catch(() => {
            bus.$emit("openSnackbar", {
              color: "error",
              text:
                "Houve um problema ao tentar registrar a consulta! Tente novamente.",
              x: "null",
              y: "top"
            });
            this.cids = [];
          })
          .finally(() => {
            bus.$emit("onLoading", false);
            this.clearForm();
            this.appointmentType = 1;
            this.cid = [];
            this.description = "";
          });
      }
    },
    clearForm() {
      this.$v.$reset();
    },
    removeCid(item) {
      const index = this.cid.indexOf(item.code);
      if (index >= 0) this.cid.splice(index, 1);
    },
    async getCidFromApi() {
      this.loadingField = true;
      return await this.$axios
        .get("/cid10", {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          }
        })
        .then(response => {
          this.cids = response.data.map(item => ({
            code: item.code,
            value: `(${item.code}) ${item.value}`
          }));
        })
        .catch(() => {
          this.cids = [];
        })
        .finally(() => (this.loadingField = false));
    },
    async getPatientFromApi() {
      bus.$emit("onLoading", true);
      return await this.$axios
        .get(`/patients/${this.userCode}`, {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          }
        })
        .then(response => {
          const results = response.data.results;
          this.patient = results.map(item => ({
            id: item.code,
            clinic: item.clinic,
            agreement: item.agreement,
            fullname: item.fullname,
            gender: item.gender,
            housePhone: item.housePhone,
            mobilePhone: item.mobilePhone,
            cpf: item.cpf,
            rg: item.rg,
            age: !item.birthDate ? "" : moment().diff(item.birthDate, "years"),
            birthDate: !item.birthDate
              ? ""
              : moment(item.birthDate).format("DD/MM/YYYY"),
            zipcode: item.zipcode,
            address: item.address,
            houseNumber: item.houseNumber,
            district: item.district,
            city: item.city,
            state: item.state,
            creationUser: item.creationUser,
            creationDate: moment(item.creationDate).format("DD/MM/YYYY HH:mm")
          }));
        })
        .catch(() => {
          this.patient = [];
        })
        .finally(() => bus.$emit("onLoading", false));
    },
    async getAppointmentsFromApi(search, page) {
      bus.$emit("onLoading", true);
      return await this.$axios
        .get(`/appointments/${this.userCode}`, {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          params: {
            perPage: 3,
            currentPage: page || 0,
            searchByDescription: search || ""
          }
        })
        .then(response => {
          const results = response.data.results;
          const pagination = response.data.pagination;
          this.appointments = results.map(item => ({
            id: item.code,
            clinic: item.clinic,
            creationUser: item.creationUser,
            creationDate: moment(item.creationDate).format("DD/MM/YYYY HH:mm"),
            description: item.description,
            cid: item.cid,
            type: item.type
          }));
          this.pagination = pagination;
        })
        .catch(() => {
          this.appointments = [];
        })
        .finally(() => bus.$emit("onLoading", false));
    }
  }
};
</script>

<style scoped>
.patient-details {
  margin: 0 auto;
}

.patient-details p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  cursor: pointer;
}

.patient-details p:nth-child(2n + 1) {
  background: #f9f9f9;
}

.patient-details p:hover {
  background: #eeeeee;
}

.patient-details p >>> strong {
  display: inline-block;
  width: 35%;
  padding: 10px 10px;
  margin-right: 10px;
}

.timeline-appointments >>> .item-description,
.timeline-appointments >>> .item-cid {
  word-wrap: break-word;
  max-height: 350px;
  overflow: auto;
}

.timeline-appointments >>> .item-description img {
  max-width: 100% !important;
}
</style>
