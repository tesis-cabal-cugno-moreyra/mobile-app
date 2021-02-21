import Vue from 'vue';

export default {
  updateNetworkStatus(state, networkStatus) {
    //Vue.set(state.networkStatus, networkStatus.key, networkStatus.value);
    state.networkStatus = networkStatus
  },
  updateApplicationStatus(state, applicationStatus) {
    alert(applicationStatus.value);
    alert(applicationStatus.key);
    Vue.set(state.applicationStatus, applicationStatus.key, applicationStatus.value);
    //state.applicationStatus = applicationStatus
  },
  updateStorageStatus(state, storageStatus) {
    state.backgroundTaskStatus = storageStatus
  }
};
