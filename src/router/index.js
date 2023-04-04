import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index/index.vue'
import Preview from '@/views/Preview/index.vue'
import Handle from '@/views/Handle/index.vue'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/preview',
    component: Preview
  },
  {
    path: '/handle',
    component: Handle
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function registerRouter(app) {
  app.use(router)
}