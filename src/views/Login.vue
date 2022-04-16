<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" color="black_selected">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Iniciar sesión</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                      id="user"
                      v-model="username"
                      label="Usuario"
                      name="user"
                      prepend-icon="mdi-account"
                      type="text"
                      :error="loginError"
                      v-on:keyup="resetErrors"
                  ></v-text-field>

                  <v-text-field
                      id="password"
                      v-model="password"
                      label="Contraseña"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      :error="loginError"
                      v-on:keyup="resetErrors"
                  ></v-text-field>

                  <v-alert v-if="loginError" color="error" icon="mdi-alert">
                    {{ this.errorMessage }}
                  </v-alert
                  >
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    :loading="tryToLogin"
                    v-on:click="loginWithJWT"
                >Ingresar
                </v-btn
                >
                <v-btn
                    color="primary"
                    :loading="tryToLogin"
                    v-on:click="confirmDomain = true"
                >Registrarse
                </v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-row justify="center">
        <v-dialog v-model="confirmDomain" persistent max-width="330">
          <v-card>
            <v-card-title>
              Codigo de acceso al dominio
            </v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="requiredCode"
                  label=" Ingrese el codigo *"
                  required
              >
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  :loading="tryToLogin"
                  color="primary"
                  text
                  v-on:click="SendConfirm(requiredCode)"
              >
                Enviar
              </v-btn>
              <v-btn
                  color="primary"
                  text
                  v-on:click="(confirmDomain = false); (requiredCode = '')"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <SignInResource></SignInResource>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import authServices from "@/services/authServices";
import SignInResource from "../components/SignInResource.vue";

export default {
  name: "Login",

  components: {
    SignInResource
  },

  data: function () {
    return {
      username: "",
      password: "",
      tryToLogin: false,
      loginError: false,
      errorMessage: "",
      confirmDomain: false,
      requiredCode: "",
      resource_id: ""
    };
  },
  methods: {
    loginWithJWT: async function () {
      this.tryToLogin = true;
      if (
          this.username !== "" &&
          this.password !== "" &&
          this.loginError === false
      ) {
        let payload = {username: this.username, password: this.password};
        await this.$store
            .dispatch("restAuth/login", payload)
            .then(response => {
              let accessToken = response.data.access_token;
              let refreshToken = response.data.refresh_token;

              this.$store.dispatch("restAuth/updateAccessToken", accessToken);
              this.$store.dispatch("restAuth/updateRefreshToken", refreshToken);

              let roles = authServices.getRoles();
              this.resource_id = response.data.user.resourceprofile.id;

              let user = {
                resourceId: response.data.user.resourceprofile.id,
                id: response.data.user.id,
                username: response.data.user.username,
                email: response.data.user.email,
                firstName: response.data.user.first_name,
                lastName: response.data.user.last_name,
                roles: roles
              };
              this.$store.dispatch("restAuth/updateUser", user);
              if (!authServices.isResource()) {
                this.loginError = true;
                this.errorMessage = "¡Ups! Este usuario no tiene un perfil relacionado del tipo Recurso!. " +
                    "Esta app solamente permite este tipo de usuarios.";
                this.$store.dispatch("restAuth/logout");
                return
              }
              if (response.data.user.resourceprofile) {
                this.sendDeviceTokenOnLogin(response.data.user.resourceprofile.id);
              }
              let resource_id = this.resource_id;
              this.$store.dispatch(
                  "uiParams/redirectToHomePage",
                  { data: {resource_id},vueRouter: this.$router }
                  );
            })
            .catch(() => {
              this.loginError = true;
              this.errorMessage = "¡Ups! Algo salió mal, intente nuevamente.";
            });
      }
      this.tryToLogin = false;
    },
    resetErrors: function () {
      this.loginError = false;
    },

    sendDeviceTokenOnLogin(resourceId) {
      if (!resourceId) {
        console.error("Resource profile id is null")
        return
      }
      this.$store.dispatch("fcmConfiguration/sendCurrentDeviceTokenToBackend", resourceId)
    },

    async SendConfirm(requiredCode) {
      this.tryToLogin = true;
      if (requiredCode.trim() === "") {
        this.$store.commit("uiParams/dispatchAlert", {
          text: "Ingrese un codigo",
          color: "primary"
        });
        this.tryToLogin = false;
        return;
      }

      await this.$store
          .dispatch("domainConfig/checkDomainAccessCode", {
            domain_code: requiredCode
          })
          .then(async () => {
            this.tryToLogin = false;

            await this.$store.commit("domainConfig/addDomainCode", requiredCode);

            this.$store.commit(
                "uiParams/changeSignInResourceState",
                !this.showSignInResource
            );

            this.confirmDomain = false;
            this.requiredCode = "";
          })
          .catch(e => {
            console.error(e);
            this.tryToLogin = false;
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Codigo incorrecto",
              color: "primary"
            });
          })
          .finally(
              async () =>
                  (this.tryToLogin = false)
          );
    },


  },

  computed: {
    ...mapGetters({
      token: "restAuth/accessToken",
      showSignInResource: "uiParams/showSignInResource",
      deviceToken: "fcmConfiguration/deviceToken"
    })
  }

};
</script>
