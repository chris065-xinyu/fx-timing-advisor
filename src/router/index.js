import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Analysis from '../pages/Analysis.vue'
import Insights from '../pages/Insights.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: Analysis
    },
    {
      path: '/insights',
      name: 'Insights',
      component: Insights
    }
  ]
})

export default router