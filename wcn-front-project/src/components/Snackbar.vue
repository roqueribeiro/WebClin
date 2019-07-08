<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :bottom="y === 'bottom'"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{text}}
    <v-btn flat @click="snackbar = false">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { bus } from "../bus";
export default {
  data: () => ({
    snackbar: false,
    color: "error",
    y: "top",
    x: "right",
    mode: "multi-line",
    timeout: 6000,
    text: "Unknown Error"
  }),
  created() {
    var vm = this;
    bus.$on("openSnackbar", function(value) {
      vm.snackbar = !vm.snackbar;
      vm.color = value.color || vm.color;
      vm.y = value.y || vm.y;
      vm.x = value.x || vm.x;
      vm.mode = value.mode || vm.mode;
      vm.timeout = value.timeout || vm.timeout;
      vm.text = value.text || vm.text;
    });
  }
};
</script>
