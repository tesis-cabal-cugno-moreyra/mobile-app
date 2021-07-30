import websocketAdapters from "@/adapters/websocketAdapters";
import {Plugins} from "@capacitor/core";


class IncidentSingleWSConnection {
  constructor(incident_id, context, point) {
    if (IncidentSingleWSConnection._instance && IncidentSingleWSConnection._instance === incident_id) {
      return IncidentSingleWSConnection._instance
    }
    IncidentSingleWSConnection._instance = this;
    this.configureWsConnection(incident_id, context, point);
  }

  configureWsConnection(incident_id, context, point) {
    this.ws = new WebSocket(`wss://tesis-cabal-cugno-moreyra-back.herokuapp.com/ws/incident/${incident_id}/`);
    this.ws.onopen = function () {
      if (point) {
        this.ws.send(websocketAdapters.pointAdapter(point));
      }
      console.info("Success opening connection with WebSocket!");
    };
    this.ws.onerror = function () {
      console.error("Failed to send a message via WebSocket.");
    }
    this.ws.onclose = () => {
      console.error("WebSocket closed!.");
      const cont = this;
      setTimeout(() => {
        console.info("Reconnecting...");
        cont.configureWsConnection(incident_id, context, point);
      }, 1000)
    }
    this.ws.onmessage = async (event) => {
      // eslint-disable-next-line no-empty
      console.log(event)
      const eventData = JSON.parse(event.data)
      if (!eventData.event_type){
        return
      }

      if (eventData.event_type === 'incident_finalized'){
        console.log('incident_finalized')
        await Plugins.BackgroundGeolocation.removeWatcher({
          id: context.$store.getters['mobileEventsStatus/backgroundProcessId']
        });
        context.$router.push({name: "ActiveIncidents"});
        context.$store.commit("uiParams/dispatchAlert", {
          text: "Incidente Finalizado!",
          color: "success",
          timeout: 4000
        });
      } else if (eventData.event_type === 'incident_cancelled') {
        console.log('incident_cancelled')
        await Plugins.BackgroundGeolocation.removeWatcher({
          id: context.$store.getters['mobileEventsStatus/backgroundProcessId']
        });
        context.$router.push({name: "ActiveIncidents"});
        context.$store.commit("uiParams/dispatchAlert", {
          text: "Incidente cancelado!",
          color: "success",
          timeout: 4000
        });
      } else {
        console.error('Unsupported event type!')
      }
    }
  }

  sendPoint(point) {
    this.ws.send(websocketAdapters.pointAdapter(point));
  }
}

function sendPointWithWebsocketReconnection(point) {
  let adaptedPoint = websocketAdapters.pointAdapter(point);
  const ws = new WebSocket(`wss://tesis-cabal-cugno-moreyra-back.herokuapp.com/ws/incident/${point.getIncidentId()}/`);
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

export { IncidentSingleWSConnection, sendPointWithWebsocketReconnection }
