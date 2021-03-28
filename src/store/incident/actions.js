import api from "@/services/api";

export default {
  getIncident(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let urlSearch = `/api/v1/incidents/?status=${payload.status}&page=${payload.page}`;
        return resolve(await api.get(urlSearch));
      } catch (e) {
        return reject(e);
      }
    });
  },
  postResourceIncident(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let urlResourceIncident = `/api/v1/incidents/${payload.incidentId}/resources/${payload.resourceId}/`;
        return resolve(await api.post(urlResourceIncident));
      } catch (e) {
        return reject(e);
      }
    });
  },

  deleteResourceIncident(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let urlResourceIncident = `/api/v1/incidents/${payload.incidentId}/resources/${payload.resourceId}/`;
        return resolve(await api.delete(urlResourceIncident));
      } catch (e) {
        return reject(e);
      }
    });
  },
  updateIncidentUserData(context, information) {
    this.commit("incident/updateIncidentUserData", information);
  },
  getResourceIncidents(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let urlSearch = `/api/v1/resources/${payload.resource_id}/incidents/?incident__status=${payload.incident__status}&exited_from_incident_no_date=${payload.exited_from_incident_no_date}`;
        return resolve(await api.get(urlSearch));
      } catch (e) {
        return reject(e);
      }
    });
  },
  getResourceVehicleIncident(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let urlSearch = `/api/v1/incidents/${payload.incident_id}/resources/?resource__user__username=${payload.username_Resource}&has_container_resource=${payload.has_container_resource}&resource__type__is_able_to_contain_resources=${payload.resource_to_contain_resources}`;
        return resolve(await api.get(urlSearch));
      } catch (e) {
        return reject(e);
      }
    });
  },
  updateResource(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let data =  `/api/v1/incidents/${payload.incident_id}/resources/${payload.resource_id}/`;
        return resolve(await api.put(data, payload));

      } catch (e) {
        return reject(e);
      }
    });
  },
};
