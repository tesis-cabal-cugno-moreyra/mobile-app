<template>
  <div class="home">
    <NavBar></NavBar>
    <HelloWorld/>
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
  }
}
</script>
