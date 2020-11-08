import Vue from 'vue'
import Vuex from 'vuex'

import exampleModule from "./example-module";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    exampleModule
  }
});
