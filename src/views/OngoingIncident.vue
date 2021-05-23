<template>
  <v-container>
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
              </v-icon>
            </v-btn>
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
              </v-icon>
            </v-btn>
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
              </v-icon>
            </v-btn>
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
              </v-icon>
            </v-btn>
          </div>
        </div>
        <v-dialog v-model="dialogExitIncidentStatus" max-width="300px">
          <v-card>
            <v-card-title class="justify-center"
            ><p>¿Desea salir de </p>
              <p>este incidente?</p>
            </v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="success"
                  outlined
                  @click="changeStateConfirmationExitToIncident"
                  :class="['mr-5']"
              >Salir
              </v-btn
              >
              <v-btn
                  color="primary"
                  outlined
                  @click="dialogExitIncidentStatus = false"
              >Cancelar
              </v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-dialog v-model="showMapPointSelector" max-width="300px">
          <v-card>
            <v-card-title>
              <span class="headline">Notificar situación</span>
            </v-card-title>
            <v-card-text>
              <v-textarea
                  background-color="#424240 "
                  v-model="mapPointText"
                  autocomplete="off"
                  label="Describa la situación*"
                  rows="1"
                  auto-grow
                  :error-messages="errorMapPointTexField"
              ></v-textarea>

              <v-data-table
                  v-model="TextMapPointSelected"
                  :headers="headers"
                  :items="descriptionMapPointData"
                  :single-select="singleSelect"
                  item-key="text"
                  show-select
                  hide-default-footer
              >
              </v-data-table>
            </v-card-text>
            <v-card-actions :class="['mb-2', 'pa-1', 'mr-3']">
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  text
                  v-on:click="validateMapPoint()"
              >Enviar
              </v-btn
              >
              <v-btn color="primary" text @click="onClose()">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-form>

    <resourceAbleToContainResourceList></resourceAbleToContainResourceList>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import resourceAbleToContainResourceList from "../components/ResourceAbleToContainResourceList.vue";
import NavBar from "../components/NavBar";

export default {
  name: "OngoingIncident",
  components: {NavBar, resourceAbleToContainResourceList},
  data() {
    return {
      dialogExitIncidentStatus: false,
      showMapPointSelector: false,
      mapPointText: '',
      mapPointTextRules: [v => !!v || "El texto es obligatorio"],
      errorMapPointTexField: null,
      descriptionMapPoints: [],
      loadingTable: false,
      TextMapPointSelected: [],
      singleSelect: true,
      descriptionMapPointData: [],
      headers: [
        {
        //  text: "mensaje",
          align: "start",
          sortable: false,
          value: "text"
        }
      ],
    }
  },
  watch: {
    TextMapPointSelected() {
      if(this.TextMapPointSelected.length > 0)
      {
        this.mapPointText = this.TextMapPointSelected[0].text;
        this.errorMapPointTexField = null;
      }
      else
      {
        this.mapPointText = "";
      }
    },
    showMapPointSelector()
    {
      this.getMapPointTexts();
    }
  },
  methods: {
    async leaveIncident() {
      this.dialogExitIncidentStatus = true;
    },
    async viewLinkedVehicles() {
      const dataResource = localStorage.getItem("user");
      const resourceObject = JSON.parse(dataResource)
      const username = resourceObject.username
      let idContainerResource = null;

      await this.$store
          .dispatch("incident/getResourceVehicleIncident",
              {
                incident_id: this.resourceDataIncidentData.incidentId,
                username_Resource: username,
                resource_to_contain_resources: 'false',
                has_container_resource: 'false'
              })
          .then(response => {
            if (response.data.results[0].container_resource !== null) {
              idContainerResource = response.data.results[0].container_resource.id;
            }
          })
          .catch(e => {
            console.error(e);
          })

      await this.$store
          .dispatch("incident/getResourceVehicleIncident",
              {
                incident_id: this.resourceDataIncidentData.incidentId,
                username_Resource: '',
                resource_to_contain_resources: 'true'
              })
          .then(response => {
            if (response.data.count === 0) {
              this.$store.commit("uiParams/dispatchAlert", {
                text: "De momento no hay vehiculos vinculados al incidente",
                color: "primary",
                timeout: 4000
              });
            } else {
              this.$store.commit(
                  "incident/changeVisibilityResourceToContainResource",
                  {
                    resourceToContainResource: response.data,
                    idContainerResource: idContainerResource
                  }
              );
            }
          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Hubo un problema para encontrar vehiculos vinculados al incidente",
              color: "primary",
              timeout: 4000
            });

          })

    },

    insertMapPoint() {
      this.showMapPointSelector = true

    },
    async validateMapPoint() {


        if (this.mapPointText === '') {
          this.errorMapPointTexField = 'Debe escribir o seleccionar una descripción '
        }
        else {
          this.errorMapPointTexField = null;
          await this.$store
              .dispatch("incident/postMapPointResource",
                  {
                    incident_id: this.resourceDataIncidentData.incidentId,
                    resource_id: this.userInformation.resourceId,
                    comment: this.mapPointText,
                    location: [-62.490234, -30.675715],
                    time_created: new Date()
                  })
              .then(() => {
                this.$store.commit("uiParams/dispatchAlert", {
                  text: "Se ha enviado el map point ",
                  color: "success",
                  timeout: 4000
                });
                this.showMapPointSelector = false;
              })
              .catch(e => {
                console.error(e);

                this.$store.commit("uiParams/dispatchAlert", {
                  text: "Hubo un problema para enviar el map point",
                  color: "primary",
                  timeout: 4000
                });
              })

        }



    },
    async getMapPointTexts() {
      await this.$store.dispatch("domainConfig/getDomainConfig").then(response => {

        let incidentsArray = response.data.incidentAbstractions;
        console.log(incidentsArray)
        console.log( this.resourceDataIncidentData.incidentName)
        console.log( this.resourceDataIncidentData)

        incidentsArray.forEach(incident => {
          if (incident.name === this.resourceDataIncidentData.incidentName) {
            this.descriptionMapPoints = incident.types.descriptions
          } else {
              incident.types.forEach(typeIncident => {
                if (typeIncident.name === this.resourceDataIncidentData.incidentName) {
                 this.descriptionMapPoints = typeIncident.descriptions;
                 this.descriptionMapPointData = this.descriptionMapPoints;
                 this.descriptionMapPointData.push({text: 'asdasd asdasd asdasd asdasd '})
              }
            })
          }
        })

      })
    },
    onClose() {
      this.showMapPointSelector = false;
      this.TextMapPointSelected = [];
      this.mapPointText = '';
      this.errorMapPointTexField = null;
    },
    seeIncidentLocation() {
      console.log("Aqui iria un mapa de la incidencia")
    },
    async changeStateConfirmationExitToIncident() {
      await this.$store
          .dispatch("incident/deleteResourceIncident", this.userInformation)
          .then(() => {
            this.$router.push({name: "ActiveIncidents"});

            this.$store.commit("uiParams/dispatchAlert", {
              text: "Se lo quito del incidente correctamente",
              color: "success",
              timeout: 4000
            });

          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "No se pudo quitar del incidente",
              color: "primary",
              timeout: 4000
            });

          })
    }
  },
  computed: {
    ...mapGetters({
      userInformation: "incident/incidentUserData",
      resourceDataIncidentData: "incident/incidentUserData"

    })
  }

}
</script>
