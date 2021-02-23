
export default {
  updateNetworkStatus(state, networkStatus) {
    state.networkStatus = networkStatus;
  },
  updateApplicationStatus(state, applicationStatus) {
    state.applicationIsActive = applicationStatus;
  },
  increaseStoredPointsCounter(state, increaseCounter) {
    state.storedPointsCounter = state.storedPointsCounter + increaseCounter;
  }
};
