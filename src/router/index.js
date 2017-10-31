import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Meetups from '@/components/Meetup/Meetups'
import Meetup from '@/components/Meetup/Meetup'
import SaveMeetup from '@/components/Meetup/SaveMeetup'
import Profile from '@/components/User/Profile'
import SignIn from '@/components/User/SignIn'
import SignUp from '@/components/User/SignUp'
import authGuard from '@/router/authGuard'

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
      name: 'Meetups',
      component: Meetups,
      beforeEnter: authGuard
    },
    {
      path: '/meetups/new',
      name: 'CreateMeetup',
      component: SaveMeetup,
      beforeEnter: authGuard
    },
    {
      path: '/meetups/edit/:id',
      props: true,
      name: 'EditMeetup',
      component: SaveMeetup,
      beforeEnter: authGuard
    },
    {
      path: '/meetups/:id',
      name: 'Meetup',
      props: true,
      component: Meetup,
      beforeEnter: authGuard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: authGuard
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
