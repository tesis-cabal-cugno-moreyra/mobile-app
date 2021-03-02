
<template>
  <v-app>
    <nav-bar></nav-bar>
      <v-main>
        <v-container >
          <v-btn
              @click="leaveIncident()"
              color="primary"
          >Salir del incidente</v-btn
          >
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import NavBar from "@/components/NavBar";

export default {
name: "OngoingIncident",
  components: {NavBar},
  methods: {
  async leaveIncident()
  {
    await this.$store
        .dispatch("incident/deleteResourceIncident", this.userInformation)
        .then( () => {
          this.$router.push({ name: "ActiveIncidents" });

          this.$store.commit("uiParams/dispatchAlert", {
            text: "Se lo quito del incidente correctamente",
            color: "#49cc90",
            timeout: 4000
          });

        })
        .catch(async () => {

          this.$store.commit("uiParams/dispatchAlert", {
            text: "No se pudo quitar del incidente",
            color: "primary",
            timeout: 4000
          });

          this.loadingTable = false;
        })
        .finally(async () => {
          this.loadingTable = false;
        });



  }
},
  computed: {
    ...mapGetters({
      userInformation: "incident/incidentUserData",
      resourceIdIncidentId: "incident/incidentUserData"

    })
  }

}
</script>
