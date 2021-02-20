<template>
  <v-card>
    <v-card-title :class="['pa-3', 'mt-5']">
      <v-col cols="12">
        {{ `${"Incidentes en transcurso  "}  ` }}<v-icon> mdi-truck-fast</v-icon>
      </v-col>
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
      >
        <template v-slot:top>
          <v-dialog v-model="dialogChangeVisibility" max-width="515px">
            <v-card>
              <v-card-title class="headline"
              >¿Desea unirse a este incidente?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    outlined
                    @click="enterToIncident()"
                    :class="['mr-5']"
                >Cambiar</v-btn
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
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  color="red"
                  @click="openDialogacceptance(item)"
                  :class="['mr-2']"
              >
                mdi-fire
              </v-icon>
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
export default {
  name: "ActiveIncidents",

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
          text: "Referencia de Ubicación",
          sortable: false,
          value: "location_as_string_reference"
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
   // await this.createTypeIncidentTypeList();
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
       //   searchInfo.incident_type__name !==
         // this.referenceSearch.incident_type__name ||
     //     searchInfo.visibility !== this.referenceSearch.visibility ||
        //  searchInfo.status !== this.referenceSearch.status ||
         // searchInfo.data_status !== this.referenceSearch.data_status ||
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
          .catch(async () => {
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
    //this.translate(completeData.data.results);
      this.userIncidentData = completeData.data.results
      let itemsPerPage = process.env.VUE_APP_ITEMS_PER_PAGE;
      if (!itemsPerPage) {
        console.error("Variable no declarada en: VUE_APP_ITEMS_PER_PAGE");
      }

      this.numberOfPage = Math.ceil(completeData.data.count / itemsPerPage);
    },
    openDialogacceptance(incidentSelected){
      this.incidentSelected = incidentSelected;
      this.dialogChangeVisibility = true;
    },
  async  enterToIncident(){
    console.log(this.incidentSelected)
    let information = {
      incident_id: this.incidentSelected.id,
      user_id: this.userInformation.id,
    };
      await this.$store
          .dispatch("incident/postIncidentResource", information)
          .then(response => {
            console.log(response);

          })
          .catch(async () => {

              this.$store.commit("uiParams/dispatchAlert", {
                text: "No se pudo unir al incidente",
                color: "primary",
                timeout: 4000
              });

            this.loadingTable = false;
            await this.$store.dispatch("uiParams/turnOffSpinnerOverlay");
          })
          .finally(async () => {
            await this.$store.dispatch("uiParams/turnOffSpinnerOverlay");
            this.loadingTable = false;
          });

    }
    ,
  },

  computed: {
    ...mapGetters({
      domainConfig: "domainConfig/domainConfig",
      userInformation: "restAuth/user"
    })
  }
  /*async changeStatusIncident(status) {
    this.dialogChangeStatus = false;
    this.loadingTable = true;
    await this.$store.dispatch("uiParams/turnOnSpinnerOverlay");
   /* let incidentInfo = {
      incidentId: this.incidentSelected.id,
      incidentChangeStatus: status
    };
  },*/



};
</script>