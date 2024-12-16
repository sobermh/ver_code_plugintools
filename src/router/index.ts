import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  // 映射关系：path => component
  routes: [
    {
      path: '/',
      component: () => import('@/views/main/HomeView.vue'),
      name: 'Home',
    },
    {
      path: '/about',
      component: () => import('@/views/about/AboutView.vue'),
      name: 'About',
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/notfound/NotFoundView.vue'),
      name: 'NotFound',
    },
  ],
})

//导航守卫
export default router
