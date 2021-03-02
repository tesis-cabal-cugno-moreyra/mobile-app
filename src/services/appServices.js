import { Plugins } from '@capacitor/core';
const { App } = Plugins;

export default {
  listenAppStatus(vueContext) {
    App.addListener('appStateChange', (state) => {
      // state.isActive contains the active state
      vueContext.$store.dispatch("mobileEventsStatus/changeApplicationStatus", state.isActive);
    });
  }
};
