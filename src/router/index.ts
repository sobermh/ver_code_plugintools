import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  // 映射关系：path => component
  routes: [
    {
      path: "/home",
      component: () => import("../views/main/homeView.vue"),
      name: "Home",

    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("../views/notfound/notFoundView.vue"),
      name: "NotFound",
    }
  ],
});

//导航守卫
export default router;

