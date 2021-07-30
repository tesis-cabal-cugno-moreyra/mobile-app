
export default {
  updateNetworkStatus(state, networkStatus) {
    state.networkStatus = networkStatus;
  },
  updateApplicationStatus(state, applicationStatus) {
    state.applicationIsActive = applicationStatus;
  },
  increaseStoredPointsCounter(state, increaseCounter) {
    state.storedPointsCounter = state.storedPointsCounter + increaseCounter;
  },
  resetStoredPointsCounter(state) {
    state.storedPointsCounter = 0;
  },
  updateBackgroundProcessId(state, processId) {
    if (!!processId && !!state.backgroundProcessId) {
      console.warn(`Another process was already running! New process id:${processId}, Stored process id: ${state.backgroundProcessId}`)
    }
    state.backgroundProcessId = processId
  }
};
