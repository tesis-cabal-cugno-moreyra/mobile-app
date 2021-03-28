<template>
  <v-card>
    <nav-bar></nav-bar>
    <v-card-title :class="['justify-center','pa-2', 'mt-9']">
     <p > Incidentes en transcurso<v-icon> mdi-truck-fast</v-icon></p>
    </v-card-title>
    <v-card-text :class="['pa-1']">
      <v-data-table
          :loading="loadingTable"
          loading-text="Cargando... Espere por favor"
          :headers="headersIncident"
          :items="userIncidentData"
          text-center
          item-key="id"
          :class="['pb-1']"
          hide-default-footer
          mobile-breakpoint="0"
      >
        <template v-slot:top>
          <v-dialog v-model="dialogChangeVisibility" max-width="350px">
            <v-card>
              <v-card-title  class="justify-center"
              >
                <p>¿Desea unirse a </p
                ><p>este incidente?</p> </v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    outlined
                    @click="enterToIncident()"
                    :class="['mr-5']"
                >Ingresar</v-btn
                >
                <v-btn
                    color="primary"
                    outlined
                    @click="dialogChangeVisibility = false"
                >Cancelar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  @click="openDialogAcceptance(item)"
                v-bind="attrs"
                v-on="on"
                color="primary"
                  small
              >
                unirme
              <v-icon>
                  mdi-fire
                </v-icon>
              </v-btn>
            </template>
            <span>Unirme al incidente</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-pagination
          v-model="page"
          class="my-4"
          :total-visible="10"
          :length="numberOfPage"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import NavBar from "@/components/NavBar";
export default {
  name: "ActiveIncidents",
  components: {NavBar},
  data: function() {
    return {
      showIncidentResourceList: false,
      dialogChangeStatus: false,
      userIncidentData: [],
      loadingTable: false,
      incidentSelected: {},
      dialogChangeVisibility: false,
      dialogEditResource: false,
      dialogIncidentDetails: false,
      numberOfPage: 1,
      autoCompleteIncidentType: "",
      page: 1,
      incidentStatusSelected: "Iniciado",
      incidentCompleted: "Incompleto",
      referenceSearch: {
        searchIncidentTypeName: "",
        searchVisibility:
            this.incidentVisibilitySelected === "Con asistencia externa"
                ? "With external support"
                : "Without external support",
        searchStatus: this.incidentStatusSelected,
        searchDataStatus: "Incomplete",
        page: 1
      },
      headersIncident: [
        {
          text: "Referencia",
          sortable: false,
             value: "reference"

        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false
        }
      ],
    };

  },
  async created() {
    await this.searchIncident();
  },
  watch: {
    page() {
      this.searchIncident();
    }
  },
  methods: {
    async searchIncident() {

      await this.$store.dispatch("uiParams/turnOnSpinnerOverlay");
      this.loadingTable = true;
      let incidentType = "";

      if (
          this.autoCompleteIncidentType !== "" &&
          this.autoCompleteIncidentType !== undefined
      ) {
        incidentType = this.autoCompleteIncidentType.split("-");
        incidentType = incidentType[1];
      }
      let Status = "Started";

      let searchInfo = {
       incident_type__name: incidentType,
        visibility:
            this.incidentVisibilitySelected === "Con asistencia externa"
                ? "With external support"
                : "Without external support",
        status: Status,
        data_status: "Incomplete",
        page: this.page
      };

      if (
          searchInfo.alias__alias !== this.referenceSearch.alias__alias
      ) {
        this.page = 1;
        searchInfo.page = 1;
      }

      await this.$store
          .dispatch("incident/getIncident", searchInfo)
          .then(response => {
            this.loadIncidentData(response);
            this.referenceSearch = searchInfo;
          })
          .catch(async e => {
            console.error(e);
            if (searchInfo.page !== 1) {
              this.page = this.page - 1;
              await this.searchIncident();
            } else {
              this.$store.commit("uiParams/dispatchAlert", {
                text: "No hay resultados con esas especificaciones",
                color: "primary",
                timeout: 4000
              });
            }
            this.loadingTable = false;
            await this.$store.dispatch("uiParams/turnOffSpinnerOverlay");
          })
          .finally(async () => {
            await this.$store.dispatch("uiParams/turnOffSpinnerOverlay");
            this.loadingTable = false;
          });
    },
    loadIncidentData(completeData) {
      this.userIncidentData = completeData.data.results
      let itemsPerPage = process.env.VUE_APP_ITEMS_PER_PAGE;
      if (!itemsPerPage) {
        console.error("Variable no declarada en: VUE_APP_ITEMS_PER_PAGE");
      }

      this.numberOfPage = Math.ceil(completeData.data.count / itemsPerPage);
    },

    openDialogAcceptance(incidentSelected){
      this.incidentSelected = incidentSelected;
      this.dialogChangeVisibility = true;

    },

  async  enterToIncident(){
    let incidentInformation = {
      incidentId: this.incidentSelected.id,
      resourceId: this.userInformation.resourceId,
    };
      await this.$store
          .dispatch("incident/postResourceIncident", incidentInformation)
          .then(async () => {
            await this.$store.dispatch("incident/updateIncidentUserData", incidentInformation);

            await this.$router.push({ name: "OngoingIncident" });
          })
          .catch(e => {
            console.error(e);
              this.$store.commit("uiParams/dispatchAlert", {
                text: "No se pudo unir al incidente",
                color: "primary",
                timeout: 4000
              });

            this.loadingTable = false;
          })
          .finally(async () => {
            this.loadingTable = false;
          });
    }
    ,
  },

  computed: {
    ...mapGetters({
      domainConfig: "domainConfig/domainConfig",
      userInformation: "restAuth/user",
      resourceIdIncidentId: "incident/incidentUserData"
    })
  }



};
</script>