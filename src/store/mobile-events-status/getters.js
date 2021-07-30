
export default {
  networkStatus(state) {
    return state.networkStatus;
  },
  applicationStatus(state) {
    return state.applicationIsActive;
  },
  storageStatus(state) {
    return state.storageStatus;
  },
  backgroundProcessId(state) {
    return state.backgroundProcessId;
  }
};
