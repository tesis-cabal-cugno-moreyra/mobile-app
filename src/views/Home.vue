<template>
  <div class="home">
    <NavBar></NavBar>
<!--    <HelloWorld/>-->
    <MobileTestView/>
  </div>
</template>

<script>

// import HelloWorld from '@/components/HelloWorld.vue'
import NavBar from "@/components/NavBar";
import MobileTestView from "@/components/MobileTestView";

export default {
  name: 'Home',
  components: {
    MobileTestView,
    // HelloWorld,
    NavBar
  },
  methods: {
    goLogin() {
      this.$router.push({name: 'Login'})
    }
  },

}
</script>
