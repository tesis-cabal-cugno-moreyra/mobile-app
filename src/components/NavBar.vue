<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app clipped temporary>
      <v-layout mt-4 column align-center>
        <v-flex>
          <v-avatar>
          </v-avatar>
        </v-flex>
        <v-flex>
          <p class="gray--text mt-3 headline"
             >
            {{this.userInformation.lastName}}
            {{ this.userInformation.firstName }}

          </p>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <v-list-item link v-on:click="incidentList">
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-clipboard-text</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Listado de incidentes</v-list-item-title
        >
      </v-list-item>
      <v-list-item link v-on:click="resourceStatistics">
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-chart-areaspline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Estadísticas y métricas</v-list-item-title
        >
      </v-list-item>
      <v-list-item link v-on:click="editUser">
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Configuración</v-list-item-title
        >
      </v-list-item>

      <v-switch
          class="ml-4"
          v-model="$vuetify.theme.dark"
          inset
          :label="
          `${
            $vuetify.theme.dark
              ? 'Cambiar a tema claro'
              : 'Cambiar a tema oscuro'
          }`
        "
      ></v-switch>
      <v-divider></v-divider>
      <v-list-item link v-on:click="openLogoutModal">
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Cerrar sesión</v-list-item-title
        >
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Sicoin</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <LogoutModal
        :dialog="logoutModal"
        v-on:close-modal="closeLogoutModal"
    ></LogoutModal>
  </v-container>
</template>

<script>
import LogoutModal from "@/components/LogoutModal";
import {mapGetters} from "vuex";

export default {
  name: "NavBar",
  components: {
    LogoutModal
  },
  data() {
    return {
      drawer: false,
      logoutModal: false
    };
  },
  methods: {
    closeLogoutModal() {
      this.logoutModal = false;
    },
    openLogoutModal() {
      this.logoutModal = true;
    },
    resourceStatistics() {
      this.$router.push({ name: "ResourceStatistics", params: { id: this.resourceId } })
    },
    editUser() {
      this.$store.dispatch("uiParams/hideNavBar");

      this.$store.commit(
          "uiParams/changeShowEditUserState",
          !this.showEditUser
      );
    },
    incidentList(){
      if(window.location.pathname ==! '/onGoingIncident') {
        this.$router.push({name: "ActiveIncidents"});
      }
      else
      {
        this.drawer = false

        this.$store.commit("uiParams/dispatchAlert", {
          text: "No puede ver el listado de incidentes mientras estes unido a uno",
          color: "primary",
          timeout: 4000
        });
      }
    },
    goToTestView() {
      this.$router.push({ name: "Debug" })
    }
  },
  computed: {
    ...mapGetters({
      showEditUser: "uiParams/showEditUser",
      userInformation: "restAuth/user",
      resourceId: "restAuth/resourceId"
    }),
  }
}
</script>
