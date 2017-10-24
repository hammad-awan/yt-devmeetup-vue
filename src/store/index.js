import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

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
    async loadMeetups({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const data = await firebase.database().ref('meetups').once('value')
        const meetups = []
        const obj = data.val()
        for (let key in obj) {
          const meetup = {
            id: key,
            date: new Date(obj[key].date),
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            location: obj[key].location,
            title: obj[key].title
          }
          meetups.push(meetup)
        }
        commit('setMeetups', meetups)
      } catch (error) {
        commit('setError', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async createMeetup({ commit }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString()
      }
      try {
        const data = await firebase.database().ref('meetups').push(meetup)
        meetup.id = data.key
        meetup.date = payload.date
        commit('createMeetup', meetup)
        return data.key
      } catch (error) {
        commit('setError', error)
        return null
      }
    },
    async signUpUser({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        commit('setUser', {
          id: user.uid,
          registeredMeetups: []
        })
      } catch (error) {
        commit('setError', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async signInUser({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        commit('setUser', {
          id: user.uid,
          registeredMeetups: []
        })
      } catch (error) {
        commit('setError', error)
      } finally {
        commit('setLoading', false)
      }
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
    error(state) {
      return state.error
    },
    loading(state) {
      return state.loading
    }
  }
})
