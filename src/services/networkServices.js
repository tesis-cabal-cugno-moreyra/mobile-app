import { Plugins } from '@capacitor/core';
const { Network } = Plugins;
//import store from '../store'


export default {
  async listenNetworkStatus(vueContext) {
    let initialStatus = await this.getInitialNetworkStatus();
    vueContext.$store.dispatch("mobileEventsStatus/changeNetworkStatus", initialStatus.connectionType);

    Network.addListener("networkStatusChange",  status => {
      vueContext.$store.dispatch("mobileEventsStatus/changeNetworkStatus", status.connectionType);
      // If network is down and a websocket is open (an incident is open and current user is active in it), geolocation points must be stored locally.
    });
  },
  async getInitialNetworkStatus() {
    return await Network.getStatus();
  }
};
