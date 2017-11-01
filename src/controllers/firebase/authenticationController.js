import * as firebase from 'firebase'
import User from '@/models/user'
import registeredMeetupsDao from '@/persistence/firebase/registeredMeetupsDao'

export default {
  async register(userData) {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(userData.email, userData.password)
    return new User(user.uid, [])
  },
  async signIn(userData) {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(userData.email, userData.password)
    const registeredMeetups = await registeredMeetupsDao.getRegisteredMeetups(user.uid)
    return new User(user.uid, registeredMeetups)
  },
  async autoSignIn(userId) {
    const registeredMeetups = await registeredMeetupsDao.getRegisteredMeetups(userId)
    return new User(userId, registeredMeetups)
  },
  async logout() {
    await firebase.auth().signOut()
  }
}
