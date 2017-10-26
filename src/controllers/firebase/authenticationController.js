import * as firebase from 'firebase'

export default {
  async register(userData) {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(userData.email, userData.password)
    return {
      id: user.uid,
      registeredMeetups: []
    }
  },
  async signIn(userData) {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(userData.email, userData.password)
    return {
      id: user.uid,
      registeredMeetups: []
    }
  },
  async logout() {
    await firebase.auth().signOut()
  }
}
