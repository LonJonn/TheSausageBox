<template>
  <div>
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{ title }}</h1>
          <h2 class="subtitle">
            <p>{{ subtitle[0] }}</p>
            <p v-if="subtitle[1]">{{ subtitle[1] }}</p>
            <br v-else>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "BulmaHeader",
  props: {
    title: String,
    subtitle: Array
  }
};
</script>

<style scoped>
</style>