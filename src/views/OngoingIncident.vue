
<template>
  <v-app>
      <v-main>
        <v-container >
          <v-btn
              @click="leaveIncident()"
              color="primary"
          >Salir del incidente</v-btn
          >
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
export default {
name: "OngoingIncident",
methods: {
  leaveIncident()
  {

  }
}

}
</script>
