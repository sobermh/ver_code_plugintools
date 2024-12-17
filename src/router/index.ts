import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/tools',
    },
    {
      path: '/tools',
      component: () => import('@/views/main/ToolsView.vue'),
      name: 'tools',
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/notfound/NotFoundView.vue'),
      name: 'NotFound',
    },
  ],
})

export default router
