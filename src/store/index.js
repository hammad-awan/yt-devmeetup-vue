import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://media.timeout.com/images/103444978/image.jpg',
        id: 1,
        title: 'Meetup in New York',
        date: new Date(2017, 7, 17)
      },
      {
        imageUrl:
          'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/France/Paris/paris-attractions-xlarge.jpg',
        id: 2,
        title: 'Meetup in Paris',
        date: new Date(2017, 7, 19)
      }
    ],
    user: {
      id: 'awanh',
      registeredMeetups: [1, 2]
    }
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
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
    }
  }
})
