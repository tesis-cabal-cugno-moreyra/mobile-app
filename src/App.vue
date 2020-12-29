<template>
  <v-app>
    <router-view>
    </router-view>
  </v-app>
</template>

<script>

import {
  Plugins,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

export default {
  name: 'App',
  data() {
    return {
      logoutModal: false
    };
  },
  async mounted() {
    this.$vuetify.theme.dark = true;
  },
  created() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
        (token) => {
          console.log(token.value)
          alert('Push registration success, token: ' + token.value);
          // Send token from user here, ONCE user is
          console.log(token.value)
        }
    );
    PushNotifications.addListener('registrationError', (error) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
          alert('Push received: ' + JSON.stringify(notification));
        },
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          alert('Push action performed: ' + JSON.stringify(notification));
        },
    );
  }
};
</script>
