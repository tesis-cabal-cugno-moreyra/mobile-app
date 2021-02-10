<template>
  <v-app>
    <router-view>
    </router-view>
    <AlertSnackbar></AlertSnackbar>
    <EditUserData></EditUserData>
  </v-app>
</template>

<script>

import { Plugins } from '@capacitor/core';
const { Network } = Plugins;
// const { Storage } = Plugins;

import AlertSnackbar from "@/components/AlertSnackbar.vue";
import EditUserData from "@/components/EditUserData.vue";


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
    await this.$store.dispatch("fcmConfiguration/configPushNotifications")
    Network.addListener("networkStatusChange", status => {
      // eslint-disable-next-line
      // console.log("Network status changed", status);
      // alert("Connection type: " + status.connectionType)
      if (status.connectionType === "none") {
        setTimeout(function(){
          alert("Hello");
          }, 10000);
      } else {
        alert("La conexión anda joya!")
      }


      // If network is down and a websocket is open (an incident is open and current user is active in it), geolocation points must be stored locally.
    });
  }
};
</script>
