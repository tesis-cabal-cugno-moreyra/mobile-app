import Vue from 'vue'
import Vuex from 'vuex'

import exampleModule from "./example-module";
import restAuth from "./rest-auth";
import fcmConfiguration from "./fcm-configuration"
import domainConfig from "./domain-config";
import uiParams from "./ui-params";
import incident from "./incident";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    exampleModule,
    restAuth,
    fcmConfiguration,
    domainConfig,
    uiParams,
    incident

  }
});
