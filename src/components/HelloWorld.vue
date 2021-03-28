<template>
  <v-container>
    <v-row class="text-center pt-4 mt-4">
      <v-col cols="12">
        <v-text-field
            label="Ingrese algo:"
            v-model="inputText"
            placeholder=""
            outlined
        ></v-text-field>
        <v-btn class="pa-1 ma-1" @click="saveText">Save</v-btn>
        <v-btn class="pa-1 ma-1" @click="goAbout">Go About</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({
      inputText: null
    }),
    methods: {
      saveText() {
        this.$store.dispatch("exampleModule/changeText", this.inputText);
      },
      goAbout() {
        this.$router.push({name: "About"});
      }
    }
  }
</script>
