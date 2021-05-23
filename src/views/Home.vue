<template>
  <div class="home">
    <NavBar></NavBar>
  </div>
</template>

<script>

import NavBar from "@/components/NavBar";

export default {
  // FIXME: Actually, we should redirect to here at the beginning of the application, and have here the related logic
  //   of redirection based on the current status of the incidents that the resource has related.
  name: 'Home',
  components: {
    NavBar
  },
  methods: {
  },

}
</script>
