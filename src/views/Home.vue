<template>
  <div class="home">
    <NavBar></NavBar>
    <HelloWorld/>
    <v-btn v-on:click="goLogin" >Login</v-btn>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import NavBar from "@/components/NavBar";

export default {
  name: 'Home',
  components: {
    HelloWorld,
    NavBar
  },
  methods: {
    goLogin() {
      this.$router.push({name: 'Login'})
    }
  }
}
</script>
