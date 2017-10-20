<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large info router to="/meetups">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large info router to="/meetups/new">Organize MeetUps</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item v-for="meetup in meetups" :src="meetup.imageUrl" :key="meetup.id">
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
export default {
  data() {
    return {
      meetups: [
        {
          imageUrl: 'https://media.timeout.com/images/103444978/image.jpg',
          id: 1,
          title: 'Meetup in New York'
        },
        {
          imageUrl: 'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/France/Paris/paris-attractions-xlarge.jpg',
          id: 2,
          title: 'Meetup in Paris'
        }]
    }
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
