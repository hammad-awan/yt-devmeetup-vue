import * as firebase from 'firebase'

function transformFirebaseMeetup(meetupData) {
  const obj = meetupData.val()
  const meetup = {
    id: meetupData.key,
    date: new Date(obj.date),
    description: obj.description,
    imageUrl: obj.imageUrl,
    location: obj.location,
    title: obj.title,
    creatorId: obj.creatorId
  }
  return meetup
}

export default {
  getMeetups(user, limit) {
    let query = firebase
      .database()
      .ref('meetups')
      .orderByChild('creatorId')
      .equalTo(user.id)
    if (limit) {
      query = query.limitToFirst(limit)
    }
    const meetups = []
    query.on('child_added', data => {
      const meetup = transformFirebaseMeetup(data)
      meetups.push(meetup)
    })
    return meetups.sort((m1, m2) => {
      return m1.date > m2.date
    })
  },
  async createMeetup(meetupData) {
    const meetup = {
      title: meetupData.title,
      location: meetupData.location,
      description: meetupData.description,
      date: meetupData.date.toISOString(),
      creatorId: meetupData.creatorId
    }
    let data = await firebase
      .database()
      .ref('meetups')
      .push(meetup)
    const fileName = meetupData.image.name
    const ext = fileName.slice(fileName.lastIndexOf('.'))
    const fileData = await firebase
      .storage()
      .ref(`meetups/${data.key}.${ext}`)
      .put(meetupData.image)
    const imageUrl = fileData.metadata.downloadURLs[0]
    await firebase
      .database()
      .ref('meetups')
      .child(data.key)
      .update({ imageUrl: imageUrl })
    meetup.imageUrl = imageUrl
    meetup.id = data.key
    meetup.date = data.date
    return meetup
  },
  async getMeetup(id) {
    const data = await firebase
      .database()
      .ref('meetups')
      .child(id)
      .once('value')
    return transformFirebaseMeetup(data)
  }
}
