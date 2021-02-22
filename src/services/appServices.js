import { Plugins } from '@capacitor/core';
const { App } = Plugins;

export default {
  listenAppStatus(vueContext) {
    App.addListener('appStateChange', (state) => {
      // state.isActive contains the active state
      console.log(state);
      vueContext.$store.dispatch("mobileEventsStatus/changeApplicationStatus", state.isActive);
    });
  }
};
