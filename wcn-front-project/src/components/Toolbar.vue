<template>
  <v-toolbar color="primary" dark app fixed tile>
    <v-toolbar-side-icon @click.stop="openDrawer()"></v-toolbar-side-icon>
    <v-toolbar-title>WebClin</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip left>
      <v-btn
        slot="activator"
        color="blue darken-2"
        dark
        @click.stop="openDrawerWaitingList()"
        flat
        icon
        class="ma-0"
      >
        <v-badge v-if="waitingList.length>0 && $route.name == 'home'" overlap left color="red">
          <span slot="badge" v-text="waitingList.length"></span>
          <transition name="rubberBand">
            <v-icon left color="white" class="animated" v-if="bounceList">schedule</v-icon>
          </transition>
        </v-badge>
      </v-btn>
      <span>Lista de espera</span>
    </v-tooltip>
  </v-toolbar>
</template>
<script>
import { bus } from "../bus";
export default {
  data: () => ({
    waitingList: [],
    bounceList: true
  }),
  mounted() {
    this.sockets.subscribe("WAITING_LIST", data => {
      this.waitingList = data.filter(
        item => item.clinicCode === this.$store.state.details[0].clinicCode
      );
      this.bounceList = false;
      this.$nextTick(() => (this.bounceList = true));
    });
  },
  methods: {
    openDrawer() {
      bus.$emit("openDrawer");
    },
    openDrawerWaitingList() {
      bus.$emit("openDrawerWaitingList");
    }
  }
};
</script>

<style scoped>
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.rubberBand-enter-active {
  animation-name: rubberBand;
  transform-origin: center bottom;
}

@keyframes rubberBand {
  from {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>

