import type { RouteRecordRaw } from 'vue-router'
import { auth } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Private',
    beforeEnter: async (to) => {
      return await auth(to)
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('::/view/pages/Home.vue'),
        meta: {
          title: 'home',
        },
      },
      {
        path: 'infinite-scroll',
        name: 'InfiniteScroll',
        component: () => import('::/view/pages/InfiniteScrollDemo.vue'),
      },
    ],
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('::/view/pages/SignIn.vue'),
    meta: {
      title: 'user.sign-in',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('::/view/pages/404.vue'),
    meta: {
      title: 'not-found',
    },
  },
]

export default routes
