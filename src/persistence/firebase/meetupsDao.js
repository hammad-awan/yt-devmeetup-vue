import * as firebase from 'firebase'

function transformFirebaseMeetup(meetupData) {
  const obj = meetupData.val()
  const meetup = {
    id: meetupData.key,
    date: new Date(obj.date),
    description: obj.description,
    imageUrl: obj.imageUrl,
    imageFileName: obj.imageFileName,
    location: obj.location,
    title: obj.title,
    creatorId: obj.creatorId
  }
  return meetup
}

export default {
  async getMeetups(limit) {
    let query = firebase
      .database()
      .ref('meetups')
    if (limit) {
      query = query.limitToFirst(limit)
    }
    const meetups = []
    const data = await query.once('value')
    data.forEach(child => {
      const meetup = transformFirebaseMeetup(child)
      meetups.push(meetup)
    })
    meetups.sort((m1, m2) => {
      if (m1.date > m2.date) {
        return 1
      } else if (m1.date < m2.date) {
        return -1
      } else {
        return 0
      }
    })
    return meetups
  },
  async saveMeetup(meetupData) {
    let meetup = {
      title: meetupData.title,
      location: meetupData.location,
      description: meetupData.description,
      date: meetupData.date.toISOString(),
      creatorId: meetupData.creatorId
    }
    if (meetupData.id) {
      await firebase
        .database()
        .ref('meetups')
        .child(meetupData.id)
        .update(meetup)
      meetup.id = meetupData.id
    } else {
      const data = await firebase
        .database()
        .ref('meetups')
        .push(meetup)
      meetup.id = data.key
    }
    if (meetupData.image) {
      const fileName = meetupData.image.name
      const ext = fileName.slice(fileName.lastIndexOf('.'))
      const imageFileName = `${meetup.id}.${ext}`
      if (
        meetupData.imageFileName &&
        meetupData.imageFileName !== imageFileName
      ) {
        await firebase
          .storage()
          .ref(`meetups/${meetupData.imageFileName}`)
          .delete()
      }
      const fileData = await firebase
        .storage()
        .ref(`meetups/${imageFileName}`)
        .put(meetupData.image)
      const imageUrl = fileData.metadata.downloadURLs[0]
      await firebase
        .database()
        .ref('meetups')
        .child(meetup.id)
        .update({
          imageUrl: imageUrl,
          imageFileName: fileData.metadata.name
        })
      meetup.imageUrl = imageUrl
    }
    meetup.date = meetupData.date
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
