import * as firebase from 'firebase'
import RegisteredMeetup from '@/models/registeredMeetup'

export default {
  async registerMeetup(userId, meetupId) {
    const data = await firebase
      .database()
      .ref(`users/${userId}`)
      .child('registeredMeetups')
      .push(meetupId)
    const registeredMeetup = new RegisteredMeetup(data.key, userId, meetupId)
    return registeredMeetup
  },
  async unregisterMeetup(registeredMeetup) {
    await firebase.database()
      .ref(`users/${registeredMeetup.userId}/registeredMeetups`)
      .child(registeredMeetup.id)
      .remove()
  },
  async getRegisteredMeetups(userId) {
    let registeredMeetups = []
    const data = await firebase
      .database()
      .ref(`users/${userId}/registeredMeetups`)
      .once('value')
    data.forEach(child => {
      const registeredMeetup = new RegisteredMeetup(child.key, userId, child.val())
      registeredMeetups.push(registeredMeetup)
    })
    return registeredMeetups
  }
}
