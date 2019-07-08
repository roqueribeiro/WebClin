<template>
  <v-dialog v-model="dialog" persistent width="800px">
    <v-form @submit.prevent="onSubmit">
      <v-card>
        <v-toolbar color="grey lighten-4 py-2" flat>
          <v-flex>
            <v-toolbar-title class="ml-0 pl-0 font-weight-light">
              <span>
                <v-icon class="mr-3">face</v-icon>Cadastro de Pacientes
              </span>
            </v-toolbar-title>
          </v-flex>
        </v-toolbar>
        <v-container grid-list-sm class>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-select
                v-model="agreement"
                :error-messages="agreementErrors"
                :items="agreementsList"
                item-text="value"
                item-value="code"
                :prepend-icon="!isMobile ? 'local_hospital' : ''"
                label="Convênio"
                required
                @change="$v.agreement.$touch()"
                @blur="$v.agreement.$touch()"
              ></v-select>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :prepend-icon="!isMobile ? 'face' : ''"
                label="Nome"
                required
                @change="$v.name.$touch()"
                @blur="$v.name.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model="surname"
                :error-messages="surnameErrors"
                label="Sobrenome"
                required
                @change="$v.surname.$touch()"
                @blur="$v.surname.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md2>
              <v-select
                v-model="gender"
                :error-messages="genderErrors"
                :items="[
                  { code: 1, value: 'Masculino' },
                  { code: 2, value: 'Feminino' }
                ]"
                item-text="value"
                item-value="code"
                label="Gênero"
                required
                @change="$v.gender.$touch()"
                @blur="$v.gender.$touch()"
              ></v-select>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="rg"
                :prepend-icon="!isMobile ? 'card_membership' : ''"
                label="RG"
                v-mask="'##.###.###-#'"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="cpf" label="CPF" v-mask="'###.###.###-##'"></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                :return-value.sync="birthDate"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="birthDate"
                  label="Data de Nascimento"
                  :prepend-icon="!isMobile ? 'event' : ''"
                  readonly
                  required
                ></v-text-field>
                <v-date-picker
                  ref="picker"
                  v-model="birthDate"
                  locale="pt-BR"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1900-01-01"
                  @change="$refs.menu.save(birthDate)"
                  no-title
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model="housePhone"
                type="tel"
                :prepend-icon="!isMobile ? 'phone' : ''"
                label="Telefone"
                v-mask="['(##) ####-####', '(##) #####-####']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model="mobilePhone"
                type="tel"
                :prepend-icon="!isMobile ? 'stay_current_portrait' : ''"
                label="Celular"
                v-mask="['(##) ####-####', '(##) #####-####']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="zipcode"
                :prepend-icon="!isMobile ? 'home' : ''"
                label="CEP"
                v-mask="'#####-###'"
                @blur="getAddressByZipCode()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field v-model="address" label="Endereço"></v-text-field>
            </v-flex>
            <v-flex xs12 md2>
              <v-text-field v-model="houseNumber" label="N." v-mask="'##########'"></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="district"
                :prepend-icon="!isMobile ? 'home' : ''"
                label="Bairro"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field v-model="city" label="Cidade"></v-text-field>
            </v-flex>
            <v-flex xs12 md2>
              <v-select
                v-model="state"
                :items="['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']"
                label="UF"
                required
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialog = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="submit" :disabled="$v.$invalid || loading">Cadastrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { bus } from "../bus";
import { mask } from "vue-the-mask";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import moment from "moment";

export default {
  directives: { mask },
  mixins: [validationMixin],
  validations: {
    agreement: { required },
    name: { required },
    surname: { required },
    gender: { required }
  },
  data: () => ({
    userCode: null,
    loading: false,
    dialog: false,
    agreement: 0,
    agreementsList: [],
    name: "",
    surname: "",
    gender: 0,
    rg: "",
    cpf: "",
    birthDate: "",
    housePhone: "",
    mobilePhone: "",
    zipcode: "",
    address: "",
    houseNumber: "",
    district: "",
    city: "",
    state: "",
    menu: false,
    isMobile: false
  }),
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    userCode() {
      this.userCode ? this.getPatientDataFromApi() : null;
    },
    dialog() {
      if (!this.dialog) {
        this.clearForm();
        this.userCode = 0;
        this.agreement = 0;
        this.name = "";
        this.surname = "";
        this.gender = 0;
        this.rg = "";
        this.cpf = "";
        this.birthDate = "";
        this.housePhone = "";
        this.mobilePhone = "";
        this.zipcode = "";
        this.address = "";
        this.houseNumber = "";
        this.district = "";
        this.city = "";
        this.state = "";
      }
    }
  },
  created() {
    var vm = this;
    this.getAgreementsFromApi();
    bus.$on("openDialogNewPatient", function(value) {
      vm.dialog = !vm.dialog;
      if (!value) return;
      vm.userCode = value.userCode || vm.userCode;
    });
    bus.$on("onLoading", function(value) {
      vm.loading = value;
    });
  },
  computed: {
    agreementErrors() {
      const errors = [];
      if (!this.$v.agreement.$dirty) return errors;
      !this.$v.agreement.required && errors.push("Requerido");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Requerido");
      return errors;
    },
    surnameErrors() {
      const errors = [];
      if (!this.$v.surname.$dirty) return errors;
      !this.$v.surname.required && errors.push("Requerido");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.gender.$dirty) return errors;
      !this.$v.gender.required && errors.push("Requerido");
      return errors;
    }
  },
  mounted() {
    this.isMobile =
      this.$vuetify.breakpoint.name == "xs" ||
      this.$vuetify.breakpoint.name == "sm"
        ? true
        : false;
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        bus.$emit("onLoading", true);
        const params = new URLSearchParams();
        params.append("agreementCode", parseInt(this.agreement, 10));
        params.append("name", this.name.trim().toUpperCase());
        params.append("surname", this.surname.trim().toUpperCase());
        params.append("gender", parseInt(this.gender, 10));
        params.append("housePhone", this.housePhone.trim());
        params.append("mobilePhone", this.mobilePhone.trim());
        params.append("rg", this.rg.trim());
        params.append("cpf", this.cpf.trim());
        params.append("birthDate", this.birthDate);
        params.append("zipcode", this.zipcode.trim());
        params.append("address", this.address.trim().toUpperCase());
        params.append("houseNumber", parseInt(this.houseNumber, 10));
        params.append("district", this.district.trim().toUpperCase());
        params.append("city", this.city.trim().toUpperCase());
        params.append("state", this.state.trim().toUpperCase());
        params.append(
          "creationUser",
          parseInt(this.$store.state.details[0].code, 10)
        );
        params.append(
          "clinic",
          parseInt(this.$store.state.details[0].clinicCode, 10)
        );
        this.$axios({
          method: !this.userCode ? "post" : "put",
          url: !this.userCode ? "/patients" : `/patients/${this.userCode}`,
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          data: params
        })
          .then(() => {
            bus.$emit("openSnackbar", {
              color: "success",
              text: !this.userCode
                ? "Paciente cadastrado com sucesso!"
                : "Paciente alterado com sucesso!",
              x: "null",
              y: "top"
            });
          })
          .catch(() => {
            bus.$emit("openSnackbar", {
              color: "error",
              text:
                "Houve um problema ao tentar cadastrar o paciente! Tente novamente.",
              x: "null",
              y: "top"
            });
          })
          .finally(() => {
            bus.$emit("onLoading", false);
            this.dialog = false;
            bus.$emit("refreshPatients");
          });
      }
    },
    clearForm() {
      this.$v.$reset();
    },
    async getPatientDataFromApi() {
      bus.$emit("onLoading", true);
      return await this.$axios
        .get(`/patients/${this.userCode}`, {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          params: {
            perPage: 1,
            currentPage: 0
          }
        })
        .then(response => {
          response.data.results.map(item => {
            this.agreement = item.agreementCode;
            this.name = item.name;
            this.surname = item.surname;
            this.gender = item.gender;
            this.rg = item.rg;
            this.cpf = item.cpf;
            this.birthDate = moment(item.birthDate).format("YYYY-MM-DD");
            this.housePhone = item.housePhone;
            this.mobilePhone = item.mobilePhone;
            this.zipcode = item.zipcode;
            this.address = item.address;
            this.houseNumber = item.houseNumber;
            this.district = item.district;
            this.city = item.city;
            this.state = item.state;
          });
        })
        .catch(() => {
          bus.$emit("openSnackbar", {
            color: "error",
            text:
              "Houve um problema ao tentar carregar os dados do paciente! Tente novamente.",
            x: "null",
            y: "top"
          });
        })
        .finally(() => bus.$emit("onLoading", false));
    },
    async getAgreementsFromApi() {
      return await this.$axios
        .get("/agreements", {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          params: {
            perPage: 1000,
            currentPage: 0,
            searchByClinic: this.$store.state.details[0].clinicCode
          }
        })
        .then(response => {
          this.agreementsList = response.data.results.map(item => ({
            code: item.code,
            value: item.agreement
          }));
        })
        .catch(() => {})
        .finally(() => {});
    },
    async getAddressByZipCode() {
      return await this.$axios
        .get("utils/cep", {
          responseType: "json",
          headers: {
            Authorization: this.$store.state.token
          },
          params: {
            zipcode: this.zipcode
          }
        })
        .then(response => {
          this.address = response.data.logradouro.trim().toUpperCase();
          this.city = response.data.cidade.trim().toUpperCase();
          this.district = response.data.bairro.trim().toUpperCase();
          this.state = response.data.uf;
        })
        .catch(() => {})
        .finally(() => {});
    }
  }
};
</script>
