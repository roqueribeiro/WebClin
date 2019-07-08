<template>
  <v-progress-linear
    :active="loading"
    class="ma-0"
    background-color="white"
    color="primary"
    height="4"
    indeterminate
    style="position: fixed; top: 0; left: 0; z-index:9999;"
  ></v-progress-linear>
</template>

<script>
import { bus } from "../bus";
export default {
  data: () => ({
    loading: false
  }),
  created() {
    var vm = this;
    bus.$on("onLoading", function(value) {
      vm.loading = value;
    });
  }
};
</script>