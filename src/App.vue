<template>
  <v-app>
    <router-view>
    </router-view>
    <AlertSnackbar></AlertSnackbar>

  </v-app>
</template>

<script>
import AlertSnackbar from "@/components/AlertSnackbar.vue";

export default {
  name: 'App',
  components: {
    AlertSnackbar,
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
