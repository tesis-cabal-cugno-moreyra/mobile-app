<template>
  <v-form>
    <v-row justify="center">
      <v-dialog v-model="showResourceToContainResource.visible"
                v-if="showResourceToContainResource.visible?  (this.loadData = showResourceToContainResource.resourceToContainResource)
              : (this.loadData = null) "
                persistent
                width="600" dark>

        <v-card>
          <v-card-title :class="['pa-3', 'mt-7', 'black_selected']">
            <v-row align="center" justify="center">
              Vehículos relacionados
            </v-row>
          </v-card-title>

          <v-card-text :class="[' black_selected', 'pa-1']">
            <v-data-table
                :loading="loadingTable"
                loading-text="Cargando... Espere por favor"
                :headers="headersResource"
                :items="resourceData"
                text-center
                item-key="id"
                :class="['pb-1']"
                hide-default-footer
            >
              <template v-slot:top>
                <v-dialog v-model="dialogChangeStatus" max-width="500px">
                  <v-card>
                    <v-card-title class="headline"
                    >¿Desea unirse a este vehiculo?
                    </v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="success"
                          outlined
                          @click="changeStateConfirmationMessage"
                          :class="['mr-5']"
                      >Acepto
                      </v-btn
                      >
                      <v-btn
                          color="primary"
                          outlined
                          @click="dialogChangeStatus = false"
                      >Cancelar
                      </v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDeleteStatus" max-width="500px">
                  <v-card>
                    <v-card-title class="headline"
                    >¿Desea Salir de este vehiculo?
                    </v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="success"
                          outlined
                          @click="changeStateConfirmationResourceRemove"
                          :class="['mr-5']"
                      >Acepto
                      </v-btn
                      >
                      <v-btn
                          color="primary"
                          outlined
                          @click="dialogDeleteStatus = false"
                      >Cancelar
                      </v-btn
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
                        v-show="item.resource.id !== showResourceToContainResource.idContainerResource "
                        v-bind="attrs"
                        v-on="on"
                        small
                        color="success"
                        @click="openDialogPlus(item)"
                    >
                      <v-icon>
                        mdi-account-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ingresar al vehiculo</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-show="item.resource.id === showResourceToContainResource.idContainerResource"
                        v-bind="attrs"
                        v-on="on"
                        small
                        color="primary"
                        @click="openDialogRemove(item)"
                    >
                      <v-icon>
                        mdi-account-remove
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Salir del vehiculo</span>
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="onClose()">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-form>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "resourceAbleToContainResourceList",
  data() {
    return {
      referenceSearch: {
        user__first_name: "",
        user__last_name: "",
        type__name: "",
        user__is_active: true,
        page: 1
      },
      loadingTable: false,
      loadingProcessInfo: false,
      isComponentEnable: false,
      dialogChangeStatus: false,
      dialogDeleteStatus: false,
      singleSelect: false,
      searchName: "",
      searchLastName: "",
      autoCompleteTypeResource: "",
      page: 1,
      numberOfPage: 1,
      selected: [],
      typeResourceSelectedList: [],
      toJoinResource: true,
      nextPagination: null,
      headersResource: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "resource.user.username"
        },
        {text: "Tipo de recurso", sortable: false, value: "resource.type.name"},
        {
          text: "Unirse",
          value: "actions",
          sortable: false
        }
      ],
      loadData: null,
      resourceData: [],
      container_resource_id: null
    };
  },
  async mounted() {
    if (this.showResourceToContainResource.visible === true) {
      this.loadResourceData();
    }
  },
  watch: {

    page() {
      this.loadResourceData();
    },
    loadData() {
      this.loadResourceData();
    }
  },
  methods: {
    openDialogPlus(resourceData) {
      this.dialogChangeStatus = true;
      this.container_resource_id = resourceData.resource.id
    },
    openDialogRemove(resourceData) {
      this.dialogDeleteStatus = true;
      this.container_resource_id = resourceData.resource.id
    },
    async changeStateConfirmationResourceRemove() {
      let neededInfo = {
        incident_id: this.userInformation.incidentId,
        resource_id: this.userInformation.resourceId,

      }
      await this.$store
          .dispatch("incident/updateResource", neededInfo)
          .then(() => {

            this.$store.commit("uiParams/dispatchAlert", {
              text: "Se desvinculo correctamente",
              color: "success"
            });
            this.dialogDeleteStatus = false;
            this.container_resource_id = null;
            this.$store.commit(
                "incident/changeVisibilityResourceToContainResource",
                {
                  resourceToContainResource: this.showResourceToContainResource.resourceToContainResource,
                  idContainerResource: null
                }
            );
            console.log(this.showResourceToContainResource)

          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Hubo un problema para desvincularse",
              color: "primary"
            });

          })

    },
    async changeStateConfirmationMessage() {
      let neededInfo = {
        incident_id: this.userInformation.incidentId,
        resource_id: this.userInformation.resourceId,
        container_resource_id: this.container_resource_id

      }
      await this.$store
          .dispatch("incident/updateResource", neededInfo)
          .then(() => {
            console.log("gola")
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Se vinculo correctamente",
              color: "success"
            });
            this.dialogChangeStatus = false;

            this.$store.commit(
                "incident/changeVisibilityResourceToContainResource",
                {
                  resourceToContainResource: this.showResourceToContainResource.resourceToContainResource,
                  idContainerResource: this.container_resource_id
                }
            );
            this.container_resource_id = null;
          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Hubo un problema para vincularlo",
              color: "primary"
            });

          })

    },
    onClose() {
      this.$store.commit("incident/closeResourceToContainResource");
    },

    loadResourceData() {
      this.loadingTable = true;
      if (this.showResourceToContainResource.resourceToContainResource.count > 0) {
        this.resourceData = this.showResourceToContainResource.resourceToContainResource.results;

        let itemsPerPage = process.env.VUE_APP_ITEMS_PER_PAGE;
        if (!itemsPerPage) {
          console.error("Variable no declarada en: VUE_APP_ITEMS_PER_PAGE");
        }

        this.numberOfPage = Math.ceil(this.showResourceToContainResource.resourceToContainResource.count / itemsPerPage);
      }
      this.loadingTable = false;
    },

  },
  computed: {
    ...mapGetters({
      showResourceToContainResource: "incident/showResourceToContainResource",
      userInformation: "incident/incidentUserData"
    })
  }

};

</script>