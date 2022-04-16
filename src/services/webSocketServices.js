import websocketAdapters from "@/adapters/websocketAdapters";

export default {
  sendPoint(point) {
    let adaptedPoint = websocketAdapters.pointAdapter(point);
    const ws = new WebSocket(`wss://sicoin-api.moreyra.com.ar/ws/incident/${point.getIncidentId()}/`);
    ws.onopen = function () {
      ws.send(adaptedPoint);
      console.info("Success sending message through WebSocket!");
      setTimeout(() => {
        ws.close()
      }, 8000);
    };
    ws.onerror = function () {
      console.error("Failed to send a message via WebSocket.");
    }
    ws.onclose = function () {
      console.error("WebSocket closed!.");
    }
  }
}
