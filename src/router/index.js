import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import MeetUps from '@/components/MeetUp/MeetUps'
import CreateMeetUp from '@/components/MeetUp/CreateMeetUp'
import Profile from '@/components/User/Profile'
import SignIn from '@/components/User/SignIn'
import SignUp from '@/components/User/SignUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      name: 'MeetUps',
      component: MeetUps
    },
    {
      path: '/meetups/new',
      name: 'CreateMeetUp',
      component: CreateMeetUp
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    }
  ],
  mode: 'history'
})
