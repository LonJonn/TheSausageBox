import Vue from "vue";
import Router from "vue-router";
import NotFound from "./views/NotFound.vue";
import Index from "./views/Index.vue";
import Add from "./views/Add.vue";
import Delete from "./views/Delete.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/404",
      name: "NotFound",
      component: NotFound
    },
    {
      path: "/",
      name: "Index",
      component: Index
    },
    {
      path: "/add",
      name: "Add",
      component: Add
    },
    {
      path: "/delete",
      name: "Delete",
      component: Delete
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});
