import Vue from 'vue'
import Vuex from 'vuex'
import authenticationController from '@/controllers/firebase/authenticationController'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
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
    user(state) {
      return state.user
    },
    isUserAuthenticated(state, getters) {
      return !!getters.user
    }
  }
})
