<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Meetup</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="createMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field id="title" name="title" label="Title" required v-model="title">
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field id="location" name="location" label="Location" required v-model="location">
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="uploadFile">Upload Image</v-btn>
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="fileSelected">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" height="150">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field id="description" name="description" label="Description" required multi-line v-model="description">
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <h4>Choose Date & Time</h4>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
               <v-date-picker v-model="date"></v-date-picker>
            </v-flex>
          </v-layout>
          <v-layout row mt-2>
            <v-flex xs12 sm6 offset-sm3>
               <v-time-picker v-model="time"></v-time-picker>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="primary" :disabled="!formIsValid && !creating" type="submit">Create Meetup</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import meetupsDao from '@/persistence/firebase/meetupsDao'

export default {
  data() {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: '',
      date: null,
      time: null,
      image: null,
      error: null,
      creating: false
    }
  },
  computed: {
    formIsValid() {
      return (
        this.checkNotEmpty(this.title) &&
        this.checkNotEmpty(this.location) &&
        this.checkNotEmpty(this.description) &&
        this.image !== null
      )
    },
    dateTime() {
      let now = new Date()
      let strDate =
        this.date === null
          ? `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${this
              .time}`
          : `${this.date} ${this.time}`
      return moment(strDate, 'YYYY-MM-DD h:ma').toDate()
    },
    ...mapGetters(['isUserAuthenticated', 'user'])
  },
  watch: {
    async isUserAuthenticated(value) {
      if (!value) {
        this.$router.push({ name: 'SignIn' })
      }
    }
  },
  methods: {
    checkNotEmpty(str) {
      return str !== ''
    },
    async createMeetup() {
      if (!this.formIsValid) {
        return
      }
      let meetup = {
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.dateTime,
        creatorId: this.user.id
      }
      try {
        this.error = null
        this.creating = true
        meetup = await meetupsDao.createMeetup(meetup)
        this.$router.push({ name: 'Meetup', params: { id: meetup.id } })
      } catch (error) {
        this.error = error
      } finally {
        this.creating = false
      }
    },
    onDismissed() {
      this.error = null
    },
    uploadFile() {
      this.$refs.fileInput.click()
    },
    fileSelected(event) {
      const file = event.target.files[0]
      let fileName = file.name
      if (fileName.lastIndexOf('.') < 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(file)
      this.image = file
    }
  }
}
</script>

<style scoped>

</style>