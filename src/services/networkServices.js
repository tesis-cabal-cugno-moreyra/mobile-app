import { Plugins } from '@capacitor/core';
const { Network } = Plugins;

export default {
  listenNetworkStatus() {
    Network.addListener("networkStatusChange", status => {
      // eslint-disable-next-line
      // console.log("Network status changed", status);
      //alert("Connection type: " + status.connectionType)
      this.$store.dispatch("mobileEventsStatus/changeNetworkStatus", status.connectionType);
      alert(this.$store.state["mobileEventsStatus/networkStatus"]);

      // If network is down and a websocket is open (an incident is open and current user is active in it), geolocation points must be stored locally.
    });
  }
};
