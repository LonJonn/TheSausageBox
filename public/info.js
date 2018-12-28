var app = new Vue({
  el: '#vue-info',
  data() {
    return {
      info: {
        size: 0,
        percentage: 0
      }
    }
  },
  mounted() {
    axios.get("/api/info").then(response => {
      this.info = response.data
    })
  }
});