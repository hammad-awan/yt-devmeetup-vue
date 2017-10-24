<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Meetup</h4>
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
              <v-text-field id="imageUrl" name="imageUrl" label="Image URL" required v-model="imageUrl">
              </v-text-field>
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
              <v-btn class="primary" :disabled="!formIsValid" type="submit">Create Meetup</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: '',
      date: null,
      time: null
    }
  },
  computed: {
    formIsValid() {
      return (
        this.checkNotEmpty(this.title) &&
        this.checkNotEmpty(this.location) &&
        this.checkNotEmpty(this.imageUrl) &&
        this.checkNotEmpty(this.description)
      )
    },
    dateTime() {
      let now = new Date()
      let strDate = this.date === null ? `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${this.time}` : `${this.date} ${this.time}`
      return moment(strDate, 'YYYY-MM-DD h:ma').toDate()
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

      const meetup = {
        title: this.title,
        location: this.location,
        imageUrl: this.imageUrl,
        description: this.description,
        date: this.dateTime
      }
      const id = await this.$store.dispatch('createMeetup', meetup)
      if (id) {
        this.$router.push({ name: 'Meetup', params: { id: id } })
      }
    }
  }
}
</script>

<style scoped>

</style>