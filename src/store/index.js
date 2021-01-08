import Vue from 'vue'
import Vuex from 'vuex'

import exampleModule from "./example-module";
import restAuth from "./rest-auth";
import fcmConfiguration from "./fcm-configuration"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    exampleModule,
    restAuth,
    fcmConfiguration
  }
});
