<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info mb-2" v-for="meetup in meetups" :key="meetup.id">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                  height="130px"
                  :src="meetup.imageUrl"
                ></v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h5 class="white--text mb-0">{{meetup.title}}</h5>
                    <div>{{meetup.date | dateFilter }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="`/meetups/${meetup.id}`">
                    <v-icon left light>arrow_forward</v-icon>
                    View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
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
      error: null,
      loading: false
    }
  },
  methods: {
    async getMeetups() {
      try {
        this.error = null
        this.loading = true
        this.meetups = await meetupsDao.getMeetups()
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
    ...mapGetters(['isUserAuthenticated'])
  },
  watch: {
    async isUserAuthenticated(value) {
      if (!value) {
        this.meetups = []
      } else {
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

</style>