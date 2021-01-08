import api from "@/services/api";
// import domainConfigServices from "@/services/domainConfigServices";

export default {
  getDomainAccessCode() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await api.get("/api/v1/domain-config/domain-code/"));
      } catch (e) {
        return reject(e);
      }
    });
  },
  checkDomainAccessCode(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(
          await api.post("/api/v1/domain-config/domain-code/check/", payload)
        );
      } catch (e) {
        return reject(e);
      }
    });
  },
  createUser(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await api.post("/api/v1/users/", payload));
      } catch (e) {
        return reject(e);
      }
    });
  },
  createResource(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await api.post("/api/v1/resources/", payload));
      } catch (e) {
        return reject(e);
      }
    });
  },
  getDomainConfig() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const domainConfigResponse = await api.get("/api/v1/domain-config/");
        this.commit("domainConfig/addDomainConfig", domainConfigResponse.data);
    /*  this.commit(
          "domainConfig/addDomainConfigAliases",
          domainConfigServices.getDomainConfigAlias(domainConfigResponse.data)
        );
        this.commit(
          "domainConfig/addDomainConfigIncidents",
          domainConfigServices.getIncidentAbstractions(
            domainConfigResponse.data
          )
        );*/
        return resolve(domainConfigResponse);
      } catch (e) {
        return reject(e);
      }
    });
  },
  updateUser(context, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let data =  `/api/v1/users/${payload.id}/`;
        return resolve(await api.put(data, payload));

      } catch (e) {
        return reject(e);
      }
    });
  },


};
