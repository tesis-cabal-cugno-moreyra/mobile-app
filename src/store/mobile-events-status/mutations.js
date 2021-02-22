
export default {
  updateNetworkStatus(state, networkStatus) {
    state.networkStatus = networkStatus
  },
  updateApplicationStatus(state, applicationStatus) {
    state.applicationIsActive = applicationStatus
  },
  updateStorageStatus(state, storageStatus) {
    state.backgroundTaskStatus = storageStatus
  }
};
