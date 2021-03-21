
<template>
  <v-container >
    <nav-bar></nav-bar>
    <v-row align="center" dense class="pt-4 mt-4">
        <v-col cols="12">
      <div class="text-center">
        <div class="my-8">
        <v-btn
            min-width="300"
            @click="viewLinkedVehicles()"
          color="primary"
            class="pa-5"
      >Ver vehículos vinculados
          <v-icon class="ml-3">
            mdi-truck-check
          </v-icon></v-btn>
        </div>

        <div class="my-8">
        <v-btn
            min-width="300"
            @click="insertMapPoint()"
            color="primary"
            class="pa-5"
        >Notificar situación
          <v-icon class="ml-13">
            mdi-cellphone-information
          </v-icon></v-btn>
        </div>

        <div>
          <v-btn
            min-width="300"
          @click="seeIncidentLocation()"
          color="primary"
          class="pa-5"
        >Ver mapa del incidente
            <v-icon class="ml-4">
              mdi-map-marker
            </v-icon></v-btn>
        </div>
        <div class="my-8">
          <v-btn
          min-width="300"
        @click="leaveIncident()"
        color="primary"
        class="pa-5"
      >Salir del incidente
        <v-icon class="ml-13">
          mdi-exit-to-app
        </v-icon></v-btn>
      </div >
      </div>
        </v-col>
    </v-row>
    <resourceAbleToContainResourceList></resourceAbleToContainResourceList>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import resourceAbleToContainResourceList from "../components/ResourceAbleToContainResourceList.vue";
import NavBar from "../components/NavBar";

export default {
name: "OngoingIncident",
  components: {NavBar, resourceAbleToContainResourceList},
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

        })
  },
    async viewLinkedVehicles(){

      await this.$store
          .dispatch("incident/getResourceVehicleIncident", {incident_id: this.resourceIdIncidentId.incidentId})
          .then(response  => {
            console.log(response);
            if(response.data.count === 0)
            {
              this.$store.commit("uiParams/dispatchAlert", {
              text: "De momento no hay vehiculos vinculados al incidente",
              color: "primary",
              timeout: 4000
            });
            }
            else{
              this.$store.commit(
                  "incident/changeVisibilityResourceToContainResource"
              );
            }
          console.log("se tiene que abrir una ventana")


          })
          .catch(async () => {

            this.$store.commit("uiParams/dispatchAlert", {
              text: "De momento no hay vehiculos vinculados al incidente",
              color: "primary",
              timeout: 4000
            });

          })

    console.log(this.resourceIdIncidentId)
    },
    insertMapPoint(){
    console.log("aiuuuudaa")
    },
    seeIncidentLocation(){
    console.log("sesa")
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
