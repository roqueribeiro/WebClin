<template>
  <v-app>
    <Progress/>
    <Snackbar/>
    <transition name="slide-right" mode="out-in">
      <router-view/>
    </transition>
  </v-app>
</template>

<script>
import Progress from "./components/Progress";
import Snackbar from "./components/Snackbar";

export default {
  components: {
    Progress,
    Snackbar
  }
};
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
