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

export default {
name: "MobileTestView",
  computed: {
    ...mapState('mobileEventsStatus', ['networkStatus', 'applicationIsActive', 'storedPointsCounter'])
  },
  methods: {
    tryToSendPoint() {
      console.log("try to send point!");
    },
    async storePoint() {

      let currentPosition = await geolocationServices.getCurrentPosition();
      let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
      await storageServices.setMapPoint(mapPoint);
      console.log("point stored!");
      // Obtener la geolocalización, instanciar la clase correspondiente y almacenarla.
    },
    sendPoint() {
      //let currentPosition = await geolocationServices.getCurrentPosition();
      //let mapPoint = new MapPoint(currentPosition.coords, 1, "Probando websocket");
      const ws = new WebSocket('wss://tesis-cabal-cugno-moreyra-back.herokuapp.com/ws/incident/1/');
      ws.onopen = function () {
        let data = JSON.stringify({"type": "map_point", "data": {"lat": "12", "long": "23", "message": "Beep beep!"}})
        ws.send(data);
      };
      ws.onclose = function() {
        console.error("Websocket closed!");
      }
      console.log("network it's OK, point must be sended!");
      // Obtener la geolocalización, instanciar la clase correspondiente y enviarla.
    }
  }

};
</script>

<style scoped>

</style>
