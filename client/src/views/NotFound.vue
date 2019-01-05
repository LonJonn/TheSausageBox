<template>
  <BulmaHeader
    title="Oh No... Dead end. 😢"
    v-bind:subtitle="['That page doesn\'t exist!',
    'Sorry about that.']"
  />
</template>

<script>
import BulmaHeader from "@/components/BulmaHeader.vue";

export default {
  name: "NotFound",
  components: {
    BulmaHeader
  }
};
</script>
