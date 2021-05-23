export default {
  mapPointAdapter(mapPoint) {
    console.log(mapPoint);
    let object = {
      type: "map_point",
      data: {
        lat: mapPoint.getLat(),
        lng: mapPoint.getLng(),
        message: mapPoint.getComment(),
        incidentId: mapPoint.getIncidentId(),
        resourceId: mapPoint.getResourceId(),
        timeCreated: mapPoint.getTimeCreated()
      }
    }
    console.log(JSON.stringify(object))
    return JSON.stringify(object)
  },
  trackPointAdapter(trackPoint) {
    console.log(trackPoint);
    let object = {
      type: "track_point",
      data: {
        lat: trackPoint.getLat(),
        lng: trackPoint.getLng(),
        incidentId: trackPoint.getIncidentId(),
        resourceId: trackPoint.getResourceId(),
        timeCreated: trackPoint.getTimeCreated()
      }
    }
    console.log(JSON.stringify(object))
    return JSON.stringify(object)
  },
  pointAdapter(point) {
    console.log(`websocketAdapter: point lat: ${point.getLat()}, long: ${point.getLng()}`)
    if (point.internalType === "MapPoint") {
      return this.mapPointAdapter(point);
    } else if (point.internalType === "TrackPoint") {
      return this.trackPointAdapter(point);
    } else {
      console.error("Point can't be adapted. Only MapPoint or TrackPoint can be.")
      return null;
    }
  }
}
