<template>
  <div class="home">
    <NavBar></NavBar>
    <MobileTestView/>
  </div>
</template>

<script>

import NavBar from "@/components/NavBar";
import MobileTestView from "@/components/MobileTestView";

export default {
  name: 'Home',
  components: {
    MobileTestView,
    NavBar
  },
  methods: {
  },

}
</script>
