<template>
  <v-main>
    <v-form ref="form" lazy-validation>
      <v-row justify="center">
        <v-dialog v-model="showEditUser" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Edicion de usuario</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row
                ><v-col cols="12" sm="8" md="8">
                  <v-text-field
                      v-model="userName"
                      :rules="userNameRules"
                      autocomplete="off"
                      label="Nombre de usuario*"
                      disabled
                  ></v-text-field>
                </v-col>
                  <v-col cols="12" sm="6" md="5">
                    <v-text-field
                        v-model="name"
                        :rules="[v => !!v || 'El nombre es obligatorio']"
                        autocomplete="off"
                        label="Nombre*"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        v-model="lastName"
                        :rules="[v => !!v || 'El apellido es obligatorio']"
                        label="Apellido*"
                        required
                        autocomplete="off"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="11">
                    <v-text-field
                        label="Email *"
                        required
                        autocomplete="off"
                        v-model="email"
                        :rules="emailRules"
                        :error-messages="errorEmailField"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>* Campos requeridos</small>
            </v-card-text>
            <v-card-actions :class="['mb-2', 'pa-1', 'mr-3']">
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  :loading="loadingCreate"
                  text
                  v-on:click="validateAndEditUser()"
              >Guardar</v-btn
              >
              <v-btn color="primary" text @click="onClose()">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-form>
  </v-main>
</template>
<script>
import {mapGetters} from "vuex";

export default {
name: "EditUserData",

  data: function (){
    return {
      loadingCreate: false,
      idUser: "",
      userName: "",
      name: "",
      lastName: "",
      userNameRules: [
        v => !!v || "El nombre de usuario es obligatorio",
        v =>
            (v && v.length <= 15) ||
            "El nombre de usuario no debe exceder los 15 caracteres"
      ],
      email: "",
      emailRules: [
        v => !!v || "El E-mail es obligatorio",
        v => /.+@.+\..+/.test(v) || "El e-mail debe ser valido"
      ],
      autoCompleteTypeResource: "",
      typeResourceSelectedList: [],
      errorEmailField: null,
      errorUserNameField: null,
      domainAccessCode: null,
    };
  },
  async mounted() {
    if (this.typeResourceSelectedList.length === 0) {
      this.$store.dispatch("domainConfig/getDomainConfig").then(response => {
        let incidentAbstractions = response.data.incidentAbstractions;
        let resourceTypes = [];
        incidentAbstractions.forEach(incidentAbstraction => {
          incidentAbstraction.types.forEach(incidentType => {
            resourceTypes = resourceTypes.concat(incidentType.resourceTypes);
          });
        });
        // Se convierte en json para poder quitar los tipos de recursos repetidos y se vuelve a crear el objeto
        this.typeResourceSelectedList = [
          ...new Set(resourceTypes.map(JSON.stringify))
        ].map(JSON.parse);
      });
    }
    await this.$store
        .dispatch("domainConfig/getDomainAccessCode")
        .then(response => {
          this.domainAccessCode = response.data.domain_code;
        });
  },
  watch: {
    showEditUser()
    {
      this.mapData();
    }

},
  methods:{
  onClose(){
    this.$store.commit(
        "uiParams/changeShowEditUserState",
        !this.showEditUser
    );
  },
    mapData()
    {
      this.idUser = this.userInformation.id;
      this.userName = this.userInformation.username;
      this.name = this.userInformation.firstName;
      this.lastName = this.userInformation.lastName;
      this.email = this.userInformation.email;
      this.autoCompleteTypeResource = this.userInformation.roles[0];
    },
    async validateAndEditUser()
    {
      this.loadingCreate = true;

      let userInfo = {
        id : this.idUser,
        first_name : this.name,
        last_name : this.lastName,
        email : this.email

      }
      await this.$store
          .dispatch("domainConfig/updateUser", userInfo)
          .then( ()=> {
            this.userInformation.firstName = userInfo.first_name;
            this.userInformation.lastName = userInfo.last_name;
            this.userInformation.email = userInfo.email;

            this.$store.commit("uiParams/dispatchAlert", {
              text: "Información del usuario editada correctamente",
              color: "success"
            });
            this.$store.commit(
                "uiParams/changeShowEditUserState",
                !this.showEditUser
            );
          })
          .catch(e => {
            console.error(e);
            this.$store.commit("uiParams/dispatchAlert", {
              text: "Hubo un problema con la edición del usuario",
              color: "primary"
            });

          })
      this.loadingCreate = false;

    }
  },
  computed: {
    ...mapGetters({
      domainConfig: "domainConfig/domainConfig",
      showEditUser: "uiParams/showEditUser",
      userInformation: "restAuth/user",

    })
  }
}

</script>
