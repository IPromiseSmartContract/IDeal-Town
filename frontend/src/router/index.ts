import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectView from '@/views/ProjectView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import DaoProposalView from '@/views/DaoProposalView.vue'
import CreateProjectVue from '@/views/CreateProject.vue'
import ProjectOpenVue from '@/components/Steps/ProjectOpen.vue'
import ProjectVoteVue from '@/components/Steps/ProjectVote.vue'
import ProjectReviewVue from '@/components/Steps/ProjectReview.vue'
import ProjectRewardVue from '@/components/Steps/ProjectReward.vue'

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
            path: '/project/:address/open',
            name: 'projectopen',
            component: ProjectOpenVue
        },
        {
            path: '/project/:address/vote',
            name: 'projectvote',
            component: ProjectVoteVue
        },
        {
            path: '/project/:address/review',
            name: 'projectreview',
            component: ProjectReviewVue
        },
        {
            path: '/project/:address/reward',
            name: 'projectreward',
            component: ProjectRewardVue
        },
        {
            path: '/project/:address/close',
            name: 'projectclose',
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
