import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@/assets/index.js'
import VeeValidate from "vee-validate";

Vue.config.productionTip = false;
Vue.use(Buefy)
Vue.use(VeeValidate, {
  events: ""
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
