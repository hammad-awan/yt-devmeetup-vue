import registeredMeetupsDao from '@/persistence/firebase/registeredMeetupsDao'

export default {
  async registerMeetup(user, meetupId) {
    if (user.isRegistered(meetupId)) {
      throw new Error('The user is already registered for the meetup.')
    }
    const registeredMeetup = await registeredMeetupsDao.registerMeetup(user.id, meetupId)
    user.registerMeetup(registeredMeetup)
  },
  async unregisterMeetup(user, meetupId) {
    const registeredMeetup = user.getRegisteredMeetup(meetupId)
    if (!registeredMeetup) {
      throw new Error('The user is not registered for the meetup.')
    }
    await registeredMeetupsDao.unregisterMeetup(registeredMeetup)
    user.unregisterMeetup(registeredMeetup)
  }
}
