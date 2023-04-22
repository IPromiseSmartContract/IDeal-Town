import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectView from '@/views/ProjectView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import DaoProposalView from '@/views/DaoProposalView.vue'
import CreateProjectVue from '@/views/CreateProject.vue'

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
            path: '/dao/proposal',
            name: 'createProposal',
            component: DaoProposalView
        },
        {
            path: '/create-project',
            name: 'CreateProjectVue',
            component: CreateProjectVue
        }
    ]
})

export default router
