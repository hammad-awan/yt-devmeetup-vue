<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h6 class="primary--text">{{meetup.title}}</h6>
          </v-card-title>
          <v-card-media
              height="400px"
              :src="meetup.imageUrl"
            ></v-card-media>
          <v-card-text>
            <div class="info--text">
              {{meetup.shortDate}} - Where it takes place
            </div>
            <div>
              lorum ipsum declorum
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
import dateUtils from '@/dateUtils'

export default {
  props: ['id'],
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetup(parseInt(this.id))
    },
    shortDate() {
      return dateUtils.toShortDate(this.meetup.date)
    }
  }
}
</script>

<style scoped>

</style>