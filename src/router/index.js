import { createRouter, createWebHistory } from 'vue-router'
import CandidateList from '../views/Candidates/CandidateList.vue'
import Calendar from '../views/Calendar/Calendar.vue'

const routes = [
  { path: '/', redirect: '/candidate' },
  { path: '/candidate', name: 'Candidate', component: CandidateList },
  { path: '/calendar', name: 'Calendar', component: Calendar }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
