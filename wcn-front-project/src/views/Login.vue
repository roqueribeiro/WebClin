<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md5>
          <v-form @submit.prevent="onSubmit">
            <v-card class="elevation-1">
              <v-img :src="require('../assets/bg-login.jpg')" aspect-ratio="3"></v-img>
              <v-card-title class="justify-center text-xs-center">
                <div>
                  <div class="headline font-weight-light">Autenticação</div>
                  <span
                    class="grey--text font-weight-light"
                  >WebClin v3 - Sistema de Gestão para Clínicas</span>
                </div>
              </v-card-title>
              <v-card-text class="px-4 pt-2 pb-0 ma-0">
                <v-text-field
                  v-model="username"
                  color="primary"
                  append-icon="person"
                  name="username"
                  label="Username"
                  type="text"
                  box
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  color="primary"
                  append-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  box
                ></v-text-field>
              </v-card-text>
              <v-divider light></v-divider>
              <v-card-actions class="justify-center">
                <v-btn type="submit" color="primary" block flat>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onSubmit() {
      const formData = {
        username: this.username,
        password: this.password
      };
      this.$store.dispatch("login", {
        username: formData.username,
        password: formData.password
      });
    }
  }
};
</script>
