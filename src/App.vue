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
  }
};
</script>
