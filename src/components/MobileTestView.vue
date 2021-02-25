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
          <v-card-text>Network status: {{ this.networkStatus }}.</v-card-text>
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
          <v-card-text>App status: {{ this.applicationIsActive }}.</v-card-text>
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
          <v-card-text>Stored points: {{ this.storedPointsCounter }}.</v-card-text>
          <v-card-actions>
            <v-btn
                color="#f3b229"
                text
                v-on:click="sendPoint()"
            >
              Enviar Point
            </v-btn>

            <v-btn
                color="#f3b229"
                text
                v-on:click="storePoint()"
            >
              Almacenar Point
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import geolocationServices from "@/services/geolocationServices";
import storageServices from "@/services/storageServices";
import { MapPoint } from "@/domain/MapPoint"
import webSocketServices from "@/services/webSocketServices";

export default {
name: "MobileTestView",
  computed: {
    ...mapState('mobileEventsStatus', ['networkStatus', 'applicationIsActive', 'storedPointsCounter'])
  },
  methods: {
    async tryToSendPoint() {
      console.log("try to send point!");
      console.log(this.networkStatus);
      if (this.networkStatus === 'wifi' || this.networkStatus === 'cellular') {
        let keys = await storageServices.getKeys()
        if (keys) {
          for (let key in keys) {
            let mapPoint = await storageServices.getMapPoint(key);
            await storageServices.removeMapPoint(key, this);
            webSocketServices.sendMapPoint(mapPoint);
          }
          let currentPosition = await geolocationServices.getCurrentPosition();
          let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
          webSocketServices.sendMapPoint(mapPoint);
        }
      } else {
        let currentPosition = await geolocationServices.getCurrentPosition();
        let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
        await storageServices.setMapPoint(mapPoint, this);
      }
    },
    async storePoint() {
      await storageServices.clear();

      let currentPosition = await geolocationServices.getCurrentPosition();
      let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
      await storageServices.setMapPoint(mapPoint, this);

      console.log(mapPoint);
      console.log("point stored!");

      let keys = await storageServices.getKeys();
      console.log(keys);

      mapPoint = await storageServices.getMapPoint(keys[0]);
      console.log(mapPoint);

      webSocketServices.sendMapPoint(mapPoint);

      // Obtener la geolocalización, instanciar la clase correspondiente y almacenarla.
    },
    async sendPoint() {
      let currentPosition = await geolocationServices.getCurrentPosition();
      let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
      webSocketServices.sendMapPoint(mapPoint);
      // Obtener la geolocalización, instanciar la clase correspondiente y enviarla.
    }
  }

};
</script>

<style scoped>

</style>
