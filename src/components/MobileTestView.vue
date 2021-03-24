<template>
    <v-container>
    <v-row dense class="pt-4 mt-4">
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
                v-on:click="tryToSendPoint()"
                :loading="sendingPoint"
                :disabled="sendingPointDisable"
            >
              Enviar Point
            </v-btn>

            <v-btn
                color="#f3b229"
                text
                v-on:click="storePoint()"
                :loading="storingPoint"
                :disabled="storingPointDisable"
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
import { TrackPoint } from "@/domain/TrackPoint";
import webSocketServices from "@/services/webSocketServices";

export default {
name: "MobileTestView",
  computed: {
    ...mapState('mobileEventsStatus', ['networkStatus', 'applicationIsActive', 'storedPointsCounter'])
  },
  data() {
    return {
      storingPoint: false,
      storingPointDisable : false,
      sendingPoint: false,
      sendingPointDisable: false
    }
  },
  methods: {
    async tryToSendPoint() {
      this.sendingPoint = true;
      this.sendingPointDisable = true;
      this.storingPointDisable = true;
      if (this.networkStatus === 'wifi' || this.networkStatus === 'cellular') {
        let keys = await storageServices.getKeys()
        if (keys.length > 0) {
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let point = await storageServices.getPoint(key);
            await storageServices.removePoint(key, this);
            await webSocketServices.sendPoint(point);
          }
        }
        let currentPosition = await geolocationServices.getCurrentPosition();
        let mapPoint = new MapPoint(currentPosition.coords, 1, 1, "Probando websocket " + this.storedPointsCounter);
        webSocketServices.sendPoint(mapPoint);
      } else {
        let currentPosition = await geolocationServices.getCurrentPosition();
        let mapPoint = new MapPoint(currentPosition.coords, 1, 1, "Probando websocket " + this.storedPointsCounter);
        await storageServices.setPoint(mapPoint, this);
      }
      this.sendingPoint = false;
      this.sendingPointDisable = false;
      this.storingPointDisable = false;
    },
    async storePoint() {
      this.storingPoint = true;
      this.storingPointDisable = true;
      this.sendingPointDisable = true;
      //await storageServices.clear(this);
      let currentPosition = await geolocationServices.getCurrentPosition();
      let trackPoint = new TrackPoint(currentPosition.coords, 1);
      await storageServices.setPoint(trackPoint, this);
      this.storingPoint = false;
      this.storingPointDisable = false;
      this.sendingPointDisable = false;
    }
  }

};
</script>

<style scoped>

</style>
