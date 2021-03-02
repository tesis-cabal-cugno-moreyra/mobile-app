
export default {
  changeNetworkStatus(context, networkStatus) {
    switch (networkStatus) {
      case "none":
        this.commit("mobileEventsStatus/updateNetworkStatus", "none");
        break;
      case "wifi":
        this.commit("mobileEventsStatus/updateNetworkStatus", "wifi");
        break;
      case "unknown":
        this.commit("mobileEventsStatus/updateNetworkStatus", "unknown");
        break;
      case "cellular":
        this.commit("mobileEventsStatus/updateNetworkStatus", "cellular");
        break;
      default:
        console.error("Error on 'changeNetworkStatus': Wrong parameter applicationStatus.");
        break;
    }
  },
  changeApplicationStatus(context, applicationStatus){
    if (applicationStatus === true || applicationStatus === false) {
      this.commit("mobileEventsStatus/updateApplicationStatus", applicationStatus);
    } else {
      console.error("Error on 'changeApplicationStatus': Wrong parameter applicationStatus. Accepts only true or false.")
    }
  },
  increaseByOneStoredPointsCounter() {
      this.commit("mobileEventsStatus/increaseStoredPointsCounter", 1);
  },
  decreaseByOneStoredPointsCounter() {
    this.commit("mobileEventsStatus/increaseStoredPointsCounter", -1);
  },
  resetStoredPointsCounter() {
    this.commit("mobileEventsStatus/resetStoredPointsCounter");
  }
};
