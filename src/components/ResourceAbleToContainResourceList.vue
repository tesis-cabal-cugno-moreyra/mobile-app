<template>
  <v-form>
    <v-card>
      <v-dialog v-model="showResourceToContainResource.visible" width="600" persistent dark>
        <v-card-title :class="['pa-4', 'mb-2', 'black_selected']">
          Recursos para relacionar
          <v-spacer></v-spacer>
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-model="searchName"
                  append-icon="mdi-magnify"
                  label="Enter para buscar por nombre"
                  v-on:keyup.enter="searchResource()"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="searchLastName"
                  append-icon="mdi-magnify"
                  label="Enter para buscar por apellido"
                  v-on:keyup.enter="searchResource()"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-autocomplete
                  v-model="autoCompleteTypeResource"
                  :items="typeResourceSelectedList"
                  item-text="name"
                  clearable
                  label="Tipo de recurso"
                  @change="searchResource()"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text :class="[' black_selected', 'pa-3']">
          <v-data-table
              :loading="loadingTable"
              loading-text="Cargando... Espere por favor"
              v-model="selected"
              :headers="headers"
              :items="resourceData"
              :single-select="singleSelect"
              item-key="id"
              show-select
              :class="['pb-1']"
              hide-default-footer
          >
          </v-data-table>
          <v-pagination
              v-model="page"
              class="my-4"
              :total-visible="10"
              :length="numberOfPage"
          ></v-pagination>
        </v-card-text>

        <v-card-actions :class="['pa-2', 'pb-1', ' black_selected']">
          <v-spacer></v-spacer>
          <v-btn
              :loading="loadingProcessInfo"
              :class="['mb-2', 'mr-1', 'primary', 'float-right']"
              v-on:click="processInfo()"
          >Continuar</v-btn
          >
          <v-btn
              :class="['pa-0', 'mb-2', 'mr-4', 'primary', 'float-right']"
              @click="onClose"
          >Cerrar</v-btn
          >
        </v-card-actions>
      </v-dialog>
    </v-card>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";

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
      singleSelect: false,
      searchName: "",
      searchLastName: "",
      autoCompleteTypeResource: "",
      page: 1,
      numberOfPage: 1,
      selected: [],
      typeResourceSelectedList: [],
      nextPagination: null,
      headers: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "user.first_name"
        },
        { text: "Apellido", sortable: false, value: "user.last_name" },
        { text: "Tipos de Recursos", sortable: false, value: "type.name" }
      ],
      resourceData: []
    };
  },
  methods: {
    onClose(){
      this.$store.commit("incident/closeResourceToContainResource");

    }

  },
  computed: {
    ...mapGetters({
      showResourceToContainResource : "incident/showResourceToContainResource"
    })
  }

}

</script>