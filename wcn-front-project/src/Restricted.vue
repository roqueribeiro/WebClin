<template>
  <v-app>
    <Progress/>
    <Snackbar/>
    <Toolbar/>
    <Drawer/>
    <DrawerWaitingList/>
    <transition name="slide-right" mode="out-in">
      <router-view/>
    </transition>
    <Modal/>
    <DialogNewPatient/>
    <v-footer color="grey lighten-5 grey--text" inset app>
      <span class="caption mx-3">&copy; 2018 - MySolver.com</span>
    </v-footer>
  </v-app>
</template>

<script>
import Progress from "./components/Progress";
import Snackbar from "./components/Snackbar";
import Toolbar from "./components/Toolbar";
import Drawer from "./components/Drawer";
import Modal from "./components/Modal";
import DialogNewPatient from "./components/DialogNewPatient";
import DrawerWaitingList from "./components/DrawerWaitingList";

export default {
  components: {
    Progress,
    Snackbar,
    Toolbar,
    Drawer,
    Modal,
    DialogNewPatient,
    DrawerWaitingList
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
