import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://media.timeout.com/images/103444978/image.jpg',
        id: 1,
        title: 'Meetup in New York',
        date: new Date(2017, 7, 17),
        description: 'I love New York!'
      },
      {
        imageUrl:
        'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/France/Paris/paris-attractions-xlarge.jpg',
        id: 2,
        title: 'Meetup in Paris',
        date: new Date(2017, 7, 19),
        description: 'C\'est La Vie in Paris'
      }
    ],
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
    }
  },
  actions: {
    createMeetup({ commit }, payload) {
      const meetup = {
        id: payload.id,
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date
      }
      // Store to persistent source
      commit('createMeetup', meetup)
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
