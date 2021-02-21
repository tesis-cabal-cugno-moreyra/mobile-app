<template>
    <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card
            color="#103f79"
            dark
        >
          <v-card-title class="headline">
            Network Info
          </v-card-title>
          <v-card-text>Network status: {{ this.networkStatus }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
            color="#f3b229"
            light
        >
          <v-card-title class="headline">
            App Info
          </v-card-title>
          <v-card-text>App status: {{ this.applicationStatus}}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
            color="#103f79"
            dark
        >
          <v-card-title class="headline">
            Storage Info
          </v-card-title>
          <v-card-text>Stored points: {{ this.storageStatus }}.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
name: "MobileTestView",
  computed: {
    ...mapState('mobileEventsStatus', ['networkStatus', 'applicationStatus', 'storageStatus'])
  }
};
</script>

<style scoped>

</style>
