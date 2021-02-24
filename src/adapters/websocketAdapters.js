export default {
  mapPointAdapter(mapPoint) {
    let object = {
      type: "map_point",
      data: {
        lat: mapPoint.getPoint().getLat(),
        long: mapPoint.getPoint().getLng(),
        message: mapPoint.getComment()
      }
    }
    return JSON.stringify(object)
  },
  trackPointAdapter(trackPoint) {
    let object = {
      type: "map_point",
      data: {
        lat: trackPoint.getPoint().getLat(),
        long: trackPoint.getPoint().getLng(),
      }
    }
    return JSON.stringify(object)
  }
}
