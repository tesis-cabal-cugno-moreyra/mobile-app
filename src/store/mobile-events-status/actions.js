
export default {
  changeNetworkStatus(context, networkStatus) {
    console.log(networkStatus)
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
        alert("mobile-events-status error");
        break;
    }
  },
  changeApplicationStatus(context, applicationStatus){
    if (applicationStatus === 'active') {
      this.commit("mobileEventsStatus/updateApplicationStatus", "active");
    } else if (applicationStatus === "inactive") {
      this.commit("mobileEventsStatus/updateApplicationStatus", "inactive");
    }
    else {
      console.error("Error on 'changeApplicationStatus': Wrong parameter applicationStatus. Accepts only active or inactive.")
    }
  },
  changeStorageStatus(context, storageStatus) {
      console.log(storageStatus);
      // TODO: Implementar junto con websocket, coordinar el objeto a almacenar para facilitar el manejo de los datos.
  }
};
