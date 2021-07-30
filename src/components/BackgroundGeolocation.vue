<template>
  <div></div>
</template>

<script>
import PointAPIManager from "@/services/PointAPIManager";
import {Plugins} from "@capacitor/core";
import {TrackPoint} from "@/domain/TrackPoint";

const {BackgroundGeolocation, Modals} = Plugins;

export default {
  name: "BackgroundGeolocation",
  props: {
    resourceId: {
      type: Number,
      required: true
    },
    incidentId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
        locations: [],
    }
  },
  methods: {
    backgroundWatcherError(error) {
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
    },
    clearLoggedLocations() {
      this.locations = []
    }
  },
  created() {
    // Get stored watcherId, if undefined, start watcher
    this.pointApiManager = new PointAPIManager(this, this.incidentId)
    const context = this;
    const watcherId = BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Cancel to prevent battery drain.",
          backgroundTitle: "Tracking You.",
          distanceFilter: 0
        },
        async function callback(location, error) {
          if (error) {
            context.backgroundWatcherError(error)
          }

          context.locations.push(location);
          // As location is relevated once per second, we divide this lecture, and send the last one
          if (context.locations.length === 10) {
            const lastLocation = context.locations.pop();
            if (lastLocation) {
              const trackPoint = new TrackPoint(
                  { latitude: lastLocation.latitude, longitude: lastLocation.longitude },
                  context.resourceId,
                  context.incidentId
              )
              await context.pointApiManager.handlePoint(trackPoint);
              context.clearLoggedLocations();
            } else {
              console.error("Location not relevated! Try again later");
            }
          }

          return console.log(location);
        }
    )
    // Only one watcher should be active. So, sending the watcher to the store and
    // listening if is active should be a valid solution for that problem
    console.log(watcherId)
    this.$store.commit('mobileEventsStatus/updateBackgroundProcessId', watcherId)
  },
}
</script>

<style scoped>

</style>