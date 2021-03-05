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
import { SplashScreen } from "@capacitor/core";

export default {
  name: 'App',
  components: {
    AlertSnackbar,
    EditUserData
  },
  data() {
    return {
      logoutModal: false
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
    await SplashScreen.hide();
  },
  async created() {
    let context = this;
    await this.$store.dispatch("fcmConfiguration/configPushNotifications");
    await networkServices.listenNetworkStatus(context);
    appServices.listenAppStatus(context);
  },
  async mounted() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
