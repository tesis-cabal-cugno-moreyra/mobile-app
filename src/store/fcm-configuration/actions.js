import { Capacitor, Plugins } from '@capacitor/core';
import api from "../../services/api";

const { PushNotifications } = Plugins;

export default {
  configPushNotifications() {
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.error('Requested permission for PushNotifications not granted')
      }
    });
    PushNotifications.addListener('registration',
        (token) => {
          this.commit("fcmConfiguration/changeDeviceToken", token);
        }
    );
  },
  async sendCurrentDeviceTokenToBackend(context, resource_id) {
    const deviceToken = context.getters.deviceToken;
    if (!deviceToken) {
      console.error('Device ID not saved in store');
      return
    }
    if (!resource_id) {
      console.error('Resource id is not set');
    }

    const payload = {
      "registration_id": deviceToken.value,
      "active": true,
      "type": Capacitor.platform
    };
    const response = await api.post(`/api/v1/resources/${resource_id}/create-or-update-device/`, payload);
    return response;
  }
};
