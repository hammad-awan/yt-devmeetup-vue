<template>
    <v-dialog v-model="dialog" persistent>
      <v-btn color="primary" dark slot="activator">
        {{registeredText}}
      </v-btn>
      <v-card>
        <v-layout row>
          <v-flex>
            <app-alert @dismissed="onDismissed" v-if="error">
              {{error.message}}
            </app-alert>
          </v-flex>
        </v-layout>
        <v-card-title class="headline">{{registeredText + ' for Meetup'}}</v-card-title>
        <v-card-text>You can always register/unregister at any time.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="confirm">{{registeredText}}</v-btn>
          <v-btn color="green darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import registeredMeetupsController from '@/controllers/firebase/registeredMeetupsController'

export default {
  props: ['meetupId'],
  data() {
    return {
      dialog: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['user']),
    isRegistered() {
      return this.user.isRegistered(this.meetupId)
    },
    registeredText() {
      return this.isRegistered ? 'Unregister' : 'Register'
    }
  },
  methods: {
    onDismissed() {
      this.error = false
    },
    async confirm() {
      try {
        this.error = null
        if (this.isRegistered) {
          await registeredMeetupsController.unregisterMeetup(this.user, this.meetupId)
        } else {
          await registeredMeetupsController.registerMeetup(this.user, this.meetupId)
        }
        this.dialog = false
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>

<style>

</style>


