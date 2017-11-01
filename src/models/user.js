class User {
  constructor(id, registeredMeetups) {
    this.id = id
    this.registeredMeetups = registeredMeetups
  }

  indexOfRegisteredMeetup(meetupId) {
    return this.registeredMeetups.findIndex(x => {
      return x.meetupId === meetupId
    })
  }

  getRegisteredMeetup(meetupId) {
    const index = this.indexOfRegisteredMeetup(meetupId)
    return this.registeredMeetups[index]
  }

  isRegistered(meetupId) {
    return this.indexOfRegisteredMeetup(meetupId) >= 0
  }

  registerMeetup(registeredMeetup) {
    this.registeredMeetups.push(registeredMeetup)
  }

  unregisterMeetup(registeredMeetup) {
    const index = this.indexOfRegisteredMeetup(registeredMeetup.meetupId)
    this.registeredMeetups.splice(index, 1)
  }
}

export default User
