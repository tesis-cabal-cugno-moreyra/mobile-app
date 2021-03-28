<template>
  <v-app>
    <router-view>
    </router-view>
    <AlertSnackbar></AlertSnackbar>
    <EditUserData></EditUserData>
  </v-app>
</template>

<script>

import AlertSnackbar from "@/components/AlertSnackbar.vue";
import EditUserData from "@/components/EditUserData.vue";
import networkServices from "@/services/networkServices";
import appServices from "@/services/appServices";
import authServices from "@/services/authServices";
import storageServices from "@/services/storageServices";
import {mapGetters} from "vuex";

export default {
  name: 'App',
  components: {
    AlertSnackbar,
    EditUserData
  },
  data() {
    return {
      logoutModal: false,
      token: null
    };
  },
  async beforeCreate() {
    await authServices.syncStorages();
    if (authServices.tokenIsExpired()) {
      let refreshToken = await storageServices.getRefreshToken();
      await this.$store.dispatch("restAuth/renewToken", refreshToken).then(response => {
        storageServices.setAccessToken(response.data.access);
        localStorage.setItem("access-token", response.data.access)
      })
    }
  },
  async created() {
    let context = this;
    await this.$store.dispatch("fcmConfiguration/configPushNotifications");
    await networkServices.listenNetworkStatus(context);
    appServices.listenAppStatus(context);

    this.token = localStorage.getItem("access-token");

    if(this.token !== 'null')
    {
      const dataResource = localStorage.getItem("user");
      const resourceObject = JSON.parse(dataResource)
      const resource_id = resourceObject.resourceId

      await this.$store.dispatch(
          "uiParams/redirectToHomePage",
          { data: {resource_id},vueRouter: this.$router }
      );

    await this.$store.dispatch("restAuth/updateUser", resourceObject);
    }
    else
    {
      if(window.location.pathname !== '/login')
      {
        await this.$router.push({name: "Login"});
      }
    }
  },
  async mounted() {
    this.$vuetify.theme.dark = true;
  },
  computed: {
    ...mapGetters({
      userData: "restAuth/user"
    })
  }
};
</script>
