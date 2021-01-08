<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app clipped temporary>
      <v-layout mt-4 column align-center>
        <v-flex>
          <v-avatar>
          </v-avatar>
        </v-flex>
        <v-flex>
          <p class="gray--text mt-3 headline">Name Lastname</p>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Página principal</v-list-item-title
        >
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon color="grey darken-1">mdi-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="grey--text text--darken-1"
        >Código de Acceso</v-list-item-title
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
    editUser() {
      this.$store.dispatch("uiParams/hideNavBar");

      this.$store.commit(
          "uiParams/changeShowEditUserState",
          !this.showEditUser
      );
    }
  },
  computed: {
    ...mapGetters({
      showEditUser: "uiParams/showEditUser",
    })
  }
}
</script>
