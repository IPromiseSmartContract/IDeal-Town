import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/ProjectView.vue'
import ProjectListView from '../views/ProjectListView.vue'
import CreateProjectView from '../views/CreateProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/project',
      name: 'projects',
      component: ProjectListView
    },
    {
      path: '/project/:address',
      name: 'project',
      component: ProjectView
    },
    {
      path: '/create-project',
      name: 'createProject',
      component: CreateProjectView
    },
  ]
})

export default router
