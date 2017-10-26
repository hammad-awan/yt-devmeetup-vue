import Vue from 'vue'
import Vuex from 'vuex'
import authenticationController from '@/controllers/firebase/authenticationController'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setMeetups(state, payload) {
      state.loadedMeetups = payload
    }
  },
  actions: {
    async register({ commit }, payload) {
      const user = await authenticationController.register(payload)
      commit('setUser', user)
    },
    async signIn({ commit }, payload) {
      const user = await authenticationController.signIn(payload)
      commit('setUser', user)
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: []
      })
    },
    async logout({ commit }) {
      await authenticationController.logout()
      commit('setUser', null)
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetup1, meetup2) => {
        return meetup1.date > meetup2.date
      })
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup(state) {
      return meetupId => {
        return state.loadedMeetups.find(meetup => {
          return meetup.id === meetupId
        })
      }
    },
    user(state) {
      return state.user
    },
    isUserAuthenticated(state, getters) {
      return !!getters.user
    },
    error(state) {
      return state.error
    },
    loading(state) {
      return state.loading
    }
  }
})
