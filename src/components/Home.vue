<template>
  <v-container v-if="isUserAuthenticated">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large color="info" to="/meetups">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large color="info" to="/meetups/new">Organize MeetUps</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate class="primary" :width="7" :size="70" v-if="loading && !hasMeetups"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel v-if="!loading && hasMeetups">
          <v-carousel-item v-for="meetup in meetups" :src="meetup.imageUrl" :key="meetup.id" @click="onLoadMeetup(meetup.id)" :style="{cursor: 'pointer'}">
            <div class="title">
              {{meetup.title}}
            </div>
          </v-carousel-item>
        </v-carousel>    
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 sm12 class="text-xs-center">
        <p>
          Join our awesome meetups!
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import meetupsDao from '@/persistence/firebase/meetupsDao'

export default {
  data() {
    return {
      meetups: [],
      loading: false,
      error: null
    }
  },
  methods: {
    async getMeetups() {
      try {
        this.error = null
        this.loading = true
        this.meetups = await meetupsDao.getMeetups(5)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    onLoadMeetup(id) {
      this.$router.push(`/meetups/${id}`)
    },
    onDismissed() {
      this.error = null
    }
  },
  computed: {
    ...mapGetters(['isUserAuthenticated', 'user']),
    hasMeetups() {
      return this.meetups.length > 0
    }
  },
  watch: {
    async isUserAuthenticated(value) {
      if (value) {
        await this.getMeetups()
      }
    }
  },
  async created() {
    if (!this.isUserAuthenticated) {
      return
    }
    await this.getMeetups()
  }
}
</script>

<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2em;
  padding: 20px;
}
</style>
