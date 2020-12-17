<template>
  <v-app>
    <router-view>
    </router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
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
