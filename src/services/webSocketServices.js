import websocketAdapters from "@/adapters/websocketAdapters";

export default {
  sendPoint(point) {
    let adaptedPoint = websocketAdapters.pointAdapter(point);
    const ws = new WebSocket('wss://tesis-cabal-cugno-moreyra-back.herokuapp.com/ws/incident/67/');
    ws.onopen = function () {
      ws.send(adaptedPoint);
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
