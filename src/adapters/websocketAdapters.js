export default {
  mapPointAdapter(mapPoint) {
    let object = {
      type: "map_point",
      data: {
        lat: mapPoint.getLat(),
        long: mapPoint.getLng(),
        message: mapPoint.getComment()
      }
    }
    return JSON.stringify(object)
  },
  trackPointAdapter(trackPoint) {
    let object = {
      type: "track_point",
      data: {
        lat: trackPoint.getLat(),
        long: trackPoint.getLng(),
      }
    }
    return JSON.stringify(object)
  },
  pointAdapter(point) {
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
