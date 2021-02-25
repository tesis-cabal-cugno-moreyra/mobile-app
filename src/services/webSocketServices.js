import websocketAdapters from "@/adapters/websocketAdapters";

export default {
  sendMapPoint(mapPoint) {
    let adaptedMapPoint = websocketAdapters.mapPointAdapter(mapPoint);
    this.sendPoint(adaptedMapPoint);
  },
  sendTrackPoint(trackPoint) {
    let adaptedTrackPoint = websocketAdapters.trackPointAdapter(trackPoint);
    this.sendPoint(adaptedTrackPoint);
  },
  sendPoint(point) {
    const ws = new WebSocket('wss://tesis-cabal-cugno-moreyra-back.herokuapp.com/ws/incident/1/');
    ws.onopen = function () {
      ws.send(point);
      console.info("Success sending message through WebSocket!");
    };
    ws.onerror = function () {
      console.error("Failed to send a message via WebSocket.");
    }
    ws.onclose = function () {
      console.error("WebSocket closed!.");
    }
  }
}
