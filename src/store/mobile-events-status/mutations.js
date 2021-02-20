import Vue from 'vue';

export default {
  updateNetworkStatus(state, networkStatus) {
    alert("Cambió el estado de la red.")
    Vue.set(state.networkStatus, networkStatus.key, networkStatus.value);
  },
  updateApplicationStatus(state, applicationStatus) {
    state.applicationStatus = applicationStatus
  },
  updateStorageStatus(state, storageStatus) {
    state.backgroundTaskStatus = storageStatus
  }
};
