<template>
  <v-container>
    <NavBar></NavBar>
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
            <v-btn
                color="#f3b229"
                text
                v-on:click="sendTrackPointOnBackground"
            >
              Background
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState} from 'vuex';
import NavBar from "@/components/NavBar";
import geolocationServices from "@/services/geolocationServices";
import storageServices from "@/services/storageServices";
import {MapPoint} from "@/domain/MapPoint"
import {TrackPoint} from "@/domain/TrackPoint";
import webSocketServices from "@/services/webSocketServices";
import {Plugins} from "@capacitor/core";
import Api from "@/services/api";

const {BackgroundGeolocation, Modals} = Plugins;

export default {
  name: "MobileTestView",
  components: { NavBar },
  computed: {
    ...mapState('mobileEventsStatus', ['networkStatus', 'applicationIsActive', 'storedPointsCounter'])
  },
  data() {
    return {
      storingPoint: false,
      storingPointDisable: false,
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
        let mapPoint = new MapPoint(currentPosition.coords, 8, 67, "Probando websocket " + this.storedPointsCounter);
        webSocketServices.sendPoint(mapPoint);
      } else {
        let currentPosition = await geolocationServices.getCurrentPosition();
        let mapPoint = new MapPoint(currentPosition.coords, 8, 67, "Probando websocket " + this.storedPointsCounter);
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
    },
    sendTrackPointOnBackground() {
      // To start listening for changes in the device's location, add a new watcher.
// You do this by calling 'addWatcher' with an options object and a callback. An
// ID is returned, which can be used to remove the watcher in the future. The
// callback will be called every time a new location is available. Watchers can
// not be paused, only removed. Multiple watchers may exist at the same time.
//       const watcher_id = BackgroundGeolocation.addWatcher(
      BackgroundGeolocation.addWatcher(
          {
            // If the "backgroundMessage" option is defined, the watcher will
            // provide location updates whether the app is in the background or the
            // foreground. If it is not defined, location updates are only
            // guaranteed in the foreground. This is true on both platforms.

            // On Android, a notification must be shown to continue receiving
            // location updates in the background. This option specifies the text of
            // that notification.
            backgroundMessage: "Cancel to prevent battery drain.",

            // The title of the notification mentioned above. Defaults to "Using
            // your location".
            backgroundTitle: "Tracking You.",

            // Whether permissions should be requested from the user automatically,
            // if they are not already granted. Defaults to "true".
            requestPermissions: true,

            // If "true", stale locations may be delivered while the device
            // obtains a GPS fix. You are responsible for checking the "time"
            // property. If "false", locations are guaranteed to be up to date.
            // Defaults to "false".
            stale: false,

            // The minimum number of metres between subsequent locations. Defaults
            // to 0.
            distanceFilter: 50
          },
          async function callback(location, error) {
            if (error) {
              if (error.code === "NOT_AUTHORIZED") {
                Modals.confirm({
                  title: "Location Required",
                  message: (
                      "This app needs your location, " +
                      "but does not have permission.\n\n" +
                      "Open settings now?"
                  )
                }).then(function ({value}) {
                  if (value) {
                    // It can be useful to direct the user to their device's
                    // settings when location permissions have been denied.
                    // The plugin provides 'openSettings' to do exactly
                    // this.
                    BackgroundGeolocation.openSettings();
                  }
                });
              }
              return console.error(error);
            }

            const response = await Api.post('/logging/', location);
            console.log(response);
            return console.log(location);
          }
      );
    }
  }

};
</script>

<style scoped>

</style>
