import { Plugins } from '@capacitor/core';
const { App } = Plugins;
import store from '../store'

export default {
  listenAppStatus() {
    App.addListener('appStateChange', (state) => {
      // state.isActive contains the active state
      store.dispatch("mobileEventsStatus/changeApplicationStatus", state.isActive);
    });
  }
};
