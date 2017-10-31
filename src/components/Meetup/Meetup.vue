<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate class="primary--text" :width="7" :size="70" v-if="loading"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="!loading && meetup">
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h6 class="primary--text">{{meetup.title}}</h6>
            <template v-if="isUserCreator">
              <v-spacer></v-spacer>
              <v-btn class="primary" fab accent :to="{name: 'EditMeetup', params: {id: id}}">
                <v-icon>edit</v-icon>
              </v-btn>
            </template>
          </v-card-title>
          <v-card-media
              height="400px"
              :src="meetup.imageUrl"
            ></v-card-media>
          <v-card-text>
            <div class="info--text">
              {{meetup.date | dateFilter}} - {{meetup.location}}
            </div>
            <div>
              {{meetup.description}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import meetupsDao from '@/persistence/firebase/meetupsDao'

export default {
  props: ['id'],
  data() {
    return {
      meetup: null,
      error: null,
      loading: false
    }
  },
  methods: {
    async getMeetup() {
      try {
        this.error = null
        this.loading = true
        this.meetup = await meetupsDao.getMeetup(this.id)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    onDismissed() {
      this.error = null
    }
  },
  computed: {
    ...mapGetters(['isUserAuthenticated', 'user']),
    isUserCreator() {
      return this.user.id === this.meetup.creatorId
    }
  },
  async created() {
    if (!this.isUserAuthenticated) {
      return
    }
    await this.getMeetup()
  }
}
</script>

<style scoped>

</style>