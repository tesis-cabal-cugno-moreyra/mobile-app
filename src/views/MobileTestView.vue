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
      <v-col cols="12">
        <v-card
            color="#103f79"
            dark
            v-if="locationWatchers"
        >
          <v-card-title class="headline">
            Watchers
          </v-card-title>
          <v-card-text>
            <v-btn
                color="#f3b229"
                text
                v-on:click="removeGeolocationWatcher(locationWatcherId)"
                v-for="(locationWatcherId, id) in locationWatchers" v-bind:key="id"
            >
              Finish watcher with id {{ locationWatcherId }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
            color="#103f79"
            dark
            v-if="locations"
        >
          <v-card-title class="headline">
            Logged locations (successfully sent: {{ successfullySentLocationsAmount }})
          </v-card-title>
          <v-card-actions>
            <v-btn
                color="#f3b229"
                text
                v-on:click="clearLoggedLocations"
            >
              Clear list
            </v-btn>
          </v-card-actions>
          <v-card-text v-for="(location, id) in locations" v-bind:key="id">
            <p>Lat, long: {{ location.latitude }}, {{ location.longitude }}</p>
            <p>Time: {{ new Date(location.time) }}</p>
          </v-card-text>
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
      sendingPointDisable: false,
      locations: [],
      locationWatchers: [],
      successfullySentLocationsAmount: 0,
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
      // const watcher_id = BackgroundGeolocation.addWatcher(
      const context = this;
      this.locationWatchers.push(BackgroundGeolocation.addWatcher(
          {
            backgroundMessage: "Cancel to prevent battery drain.",
            backgroundTitle: "Tracking You.",
            distanceFilter: 0
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
                }).then(({value}) => {
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

            context.locations.push(location);
            // As location is relevated once per second, we divide this lecture, and send the last one
            if (context.locations.length === 10) {
              const lastLocation = context.locations.pop();
              if (lastLocation) {
                const response = await Api.post('/logging/', lastLocation);
                console.log(response);
                if (response.status === 200) {
                  context.successfullySentLocationsAmount += 1;
                }
                context.clearLoggedLocations();
              } else {
                console.error("Location not relevated! Try again later");
              }
            }

            return console.log(location);
          }
      ));
    },
    removeGeolocationWatcher(watcherId) {
      BackgroundGeolocation.removeWatcher({
        id: watcherId
      });
      this.locationWatchers = this.locationWatchers.filter((id) => id !== watcherId)
    },
    clearLoggedLocations() {
      this.locations = []
    }
  }

};
</script>

<style scoped>

</style>
