import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from "vuetify/es5/locale/es";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { es },
    current: "es"
  },
  theme: {
    themes: {
      light: {
        primary: "#cc4125",
        success: "#00e64d",
        error: "#ff0000",
        first_selected: "#302f2f", // Before, grey_selected
        second_selected: "#999999", // Before, white_selected
        third_selected: "#FAFAFA" // Before,  black_selected
      },
      dark: {
        primary: "#cc4125",
        success: "#009933",
        error: "#ff0000",
        first_selected: "#999999", // Before, grey_selected
        second_selected: "#FAFAFA", // Before, white_selected
        third_selected: "#222222" // Before,  black_selected
      }
    }
  }
});
