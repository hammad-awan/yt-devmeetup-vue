<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h4 v-if="!id">Create a new Meetup</h4>
        <h4 v-if="id">Edit a Meetup</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate class="primary--text" :width="7" :size="70" v-if="loading && id"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="saveMeetup" v-if="!loading">
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
              <v-btn type="submit" color="primary" :loading="saving" @click.native="loader = 'saving'" :disabled="!formIsValid && saving">
                {{buttonText}}
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
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
import _ from 'lodash'

export default {
  props: ['id'],
  data() {
    return this.init()
  },
  computed: {
    formIsValid() {
      return (
        this.checkNotEmpty(this.title) &&
        this.checkNotEmpty(this.location) &&
        this.checkNotEmpty(this.description) &&
        (this.image || this.imageFileName)
      )
    },
    dateTime() {
      return moment(`${this.date} ${this.time}`, 'YYYY-MM-DD h:ma').toDate()
    },
    ...mapGetters(['isUserAuthenticated', 'user'])
  },
  methods: {
    dateStr(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    checkNotEmpty(str) {
      return str !== ''
    },
    async saveMeetup() {
      if (!this.formIsValid) {
        return
      }
      let meetup = {
        id: this.id,
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.dateTime,
        creatorId: this.user.id,
        imageFileName: this.imageFileName
      }
      try {
        this.error = null
        this.saving = true
        meetup = await meetupsDao.saveMeetup(meetup)
        this.$router.push({ name: 'Meetup', params: { id: meetup.id } })
      } catch (error) {
        this.error = error
      } finally {
        this.saving = false
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
    },
    async getMeetup() {
      try {
        this.error = null
        this.loading = true
        const meetup = await meetupsDao.getMeetup(this.id)
        this.title = meetup.title
        this.location = meetup.location
        this.description = meetup.description
        this.date = this.dateStr(meetup.date)
        this.time = meetup.date
        this.creatorId = meetup.creatorId
        this.imageUrl = meetup.imageUrl
        this.imageFileName = meetup.imageFileName
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    init() {
      return {
        title: '',
        location: '',
        imageUrl: '',
        imageFileName: '',
        description: '',
        date: this.dateStr(new Date()),
        time: null,
        image: null,
        error: null,
        saving: false,
        loading: false,
        buttonText: this.id ? 'Save Meetup' : 'Create Meetup'
      }
    }
  },
  watch: {
    async $route(value) {
      if (value.name === 'CreateMeetup') {
        _.extend(this, this.init())
      } else if (value.name === 'EditMeetup') {
        if (this.id) {
          await this.getMeetup()
        }
      }
    }
  },
  async created() {
    if (!this.isUserAuthenticated) {
      return
    }

    if (this.id) {
      await this.getMeetup()
    }
  }
}
</script>

<style scoped>

</style>