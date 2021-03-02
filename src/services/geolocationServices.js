import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

export default {
  async getCurrentPosition() {
    return await Geolocation.getCurrentPosition();
  }
};
