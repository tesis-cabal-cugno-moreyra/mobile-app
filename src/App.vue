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
  async mounted() {
    this.$vuetify.theme.dark = true;
  },
  async created() {
    await this.$store.dispatch("fcmConfiguration/configPushNotifications");
    networkServices.listenNetworkStatus();
    appServices.listenAppStatus();
  },
};
</script>
