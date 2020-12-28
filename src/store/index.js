import Vue from 'vue'
import Vuex from 'vuex'

import exampleModule from "./example-module";
import restAuth from "./rest-auth";
import domainConfig from "./domain-config";
import uiParams from "./ui-params";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    exampleModule,
    restAuth,
    domainConfig,
    uiParams
  }
});
