<template>
  <div class="about">
    <NavBar></NavBar>
    <v-container>
      <v-row class="text-center pt-4 mt-4">
        <v-col cols="12">
          <p>Text:</p>
          <h2 class="pb-4 mb-4" v-if="inputText">
            {{ inputText }}</h2>
          <h3 class="pb-4 mb-4" v-else>
            No hay texto guardado.</h3>
          <v-btn @click="goHome">Go Home</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavBar from "@/components/NavBar";
export default {
  name: 'About',
  components: {
    NavBar
  },
  methods: {
    saveText() {
      this.$store.dispatch("exampleModule/changeText", this.inputText);
    },
    goHome() {
      this.$router.push({name: "Home"});
    }
  },
  computed: {
    ...mapGetters({
      inputText: "exampleModule/text"
    })
  }
}
</script>
