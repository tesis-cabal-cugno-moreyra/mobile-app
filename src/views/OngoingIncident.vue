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
                @click="dialogMapPoint = true"
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

    <v-dialog
      v-model="dialogMapPoint"
      width="500"
    >
      <v-card>
        <v-form ref="mapPointForm" lazy-validation>
          <v-card-title>
            Notificar situación
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-textarea
                label="Describa la situación *"
                required
                autocomplete="off"
                v-model="mapPointComment"
                auto-grow
                rows="1"
                :error-messages="errorMapPointCommentField"
            ></v-textarea>

          </v-card-text>
          <div>
          <v-data-table
              :loadinf="loadingTable"
              loading-text="Buscando descripciones.. espere"
              v-model="TextMapPointSelected"
              :headers="headerPointTexts"
              :items="descriptionMapPointData"
              mobile-breakpoint="0"
              text-center
              :single-select="singleSelect"
              item-key="text"
              :class="['pb-1']"
              show-select
              hide-default-footer
          >
          </v-data-table>
            </div>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                text
                @click="insertMapPoint"
                :loading="loadingSendMapPoint"
            >
              Enviar
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="dialogMapPoint = false"
                :loading="loadingSendMapPoint"
            >
              Volver
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogMap"
      width="500"
    >
      <v-card>
        <v-card-title>
          Ubicación del Incidente
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-img>
            <l-map
                :zoom="15"
                :center="mapCenter"
                :options="{ zoomSnap: 0.5 }"
                style="z-index: 0; height: 65vh; width: 100%; margin-top: 16px"
                ref="incidentLocationMap"
            >
              <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <l-marker :lat-lng="mapCenter">
                <l-popup>
                  <div>
                    Ubicación del Incidente
                  </div>
                </l-popup>
              </l-marker>

            </l-map>
          </v-img>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="onClose()"
          >
            Volver a la vista principal
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <resourceAbleToContainResourceList></resourceAbleToContainResourceList>
    <background-geolocation
        :resource-id="incidentUserData.resourceId"
        :incident-id="incidentUserData.incidentId"
    ></background-geolocation>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import NavBar from "@/components/NavBar";
import resourceAbleToContainResourceList from "../components/ResourceAbleToContainResourceList.vue";
import {LatLng} from "leaflet/dist/leaflet-src.esm";
import geolocationServices from "@/services/geolocationServices";
import {MapPoint} from "@/domain/MapPoint";
import BackgroundGeolocation from "@/components/BackgroundGeolocation";
import PointAPIManager from "@/services/PointAPIManager";

export default {
  name: "OngoingIncident",
  components: {BackgroundGeolocation,NavBar, resourceAbleToContainResourceList},
  data() {
    return {
      dialogExitIncidentStatus: false,
      dialogMap: false,
      dialogMapPoint: false,
      mapCenter: new LatLng(0,0),
      loadingSendMapPoint: false,
      errorMapPointCommentField: null,
      pointApiManager: new PointAPIManager(this),
      mapPointComment: '',
      loadingTable: false,
      TextMapPointSelected: [],
      singleSelect: true,
      headerPointTexts:[
        {
         text: "descripción rápida",
          align: "start",
          sortable: false,
          value: "text"
        },
      ]
      ,
      descriptionMapPointData: [],


    }
  },
  created(){
    this.getMapPointTexts();
  },
  watch: {
    TextMapPointSelected() {
      if(this.TextMapPointSelected.length > 0)
      {
        this.mapPointComment = this.TextMapPointSelected[0].text;
        this.errorMapPointCommentField = '';
      }
      else
      {
        this.mapPointComment = "";
      }
    },
    dialogMapPoint()
    {
      if(this.dialogMapPoint === true && this.descriptionMapPointData ==![]) {
        this.getMapPointTexts();
      }
      else if(this.dialogMapPoint === false )
      {
        this.onClose();
      }
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
              incident_id: this.incidentUserData.incidentId,
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
              incident_id: this.incidentUserData.incidentId,
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

    async insertMapPoint() {
      this.loadingSendMapPoint = true;
      let isValid = this.$refs.mapPointForm.validate();

      if (!isValid || this.mapPointComment === '') {
        this.errorMapPointCommentField = "Debe describir o seleccionar una descripción"
        this.loadingSendMapPoint = false;
        return
      }

      let currentPosition = await geolocationServices.getCurrentPosition();
      await this.pointApiManager.handlePoint(new MapPoint(
          currentPosition.coords, this.incidentUserData.resourceId,
          this.incidentUserData.incidentId, this.mapPointComment
      ))
      .then(() => {
          this.$store.commit("uiParams/dispatchAlert", {
            text: "Se ha enviado el map point ",
            color: "success",
            timeout: 4000
          });
        this.onClose()
      })
            .catch(e => {

              console.error(e);

              this.$store.commit("uiParams/dispatchAlert", {
                text: "Hubo un problema para enviar el map point",
                color: "primary",
                timeout: 4000
              });
              this.onClose()

            })

    },

    seeIncidentLocation() {
      this.mapCenter = new LatLng(
          this.incidentUserData.incident.locationPoint.coordinates[0],
          this.incidentUserData.incident.locationPoint.coordinates[1]
      )
      this.dialogMap = true
      // This is a fix to show the map correctly, being a part of the map component.
      setTimeout(() => {
        //mapObject is a property that is part of leaflet
        this.$refs.incidentLocationMap.mapObject.invalidateSize();
      }, 100);
    },

    async getMapPointTexts() {
      this.loadingTable = true;
      await this.$store.dispatch("domainConfig/getDomainConfig").then(response => {

        let incidentsArray = response.data.incidentAbstractions;
        // se buscan todos los incidentes y luego los tipos de incidentes para ver cual corresponde al incidente actual
        incidentsArray.forEach(incident => {
          if (incident.name === this.incidentUserData.incident._incidentTypeName) {
            this.descriptionMapPointData = incident.types.descriptions
          } else {
            incident.types.forEach(typeIncident => {
              if (typeIncident.name === this.incidentUserData.incident._incidentTypeName) {
                this.descriptionMapPointData = typeIncident.descriptions;
              }
            })
          }
        })
      })
      this.loadingTable = false;
    },

    onClose() {
      this.dialogMap = false
      this.loadingSendMapPoint = false;
      this.TextMapPointSelected = [];
      this.mapPointComment = '';
      this.errorMapPointCommentField = null;
      this.dialogMapPoint = false;

    },

    async changeStateConfirmationExitToIncident() {
      await this.$store
        .dispatch("incident/deleteResourceIncident", this.incidentUserData)
        .then(() => {
          this.$router.push({name: "ActiveIncidents"});

            this.$store.commit("uiParams/dispatchAlert", {
              text: "Se lo quito del incidente correctamente",
              color: "success",
              timeout: 4000
            });
          this.descriptionMapPointData =[];
          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "No se pudo sacarle del incidente",
              color: "primary",
              timeout: 4000
            });

          })
    }
  },
  computed: {
    ...mapGetters({
      incidentUserData: "incident/incidentUserData",
    })
  }

}
</script>
