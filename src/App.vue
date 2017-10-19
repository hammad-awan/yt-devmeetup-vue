<template>
  <v-app>
    <v-navigation-drawer temporary v-model="sideNav">
      <v-list>
        <v-list-tile v-for="menuItem in menuItems" :key="menuItem.title" @click="onTileClick" router :to="menuItem.link">
          <v-list-tile-action>
            <v-icon>
              {{menuItem.icon}}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{menuItem.title}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="primary">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" :style="{cursor: 'pointer'}">DevMeetup</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-for="menuItem in menuItems" :key="menuItem.title" class="hidden-xs-only">
        <v-icon>{{menuItem.icon}}</v-icon>
        <v-btn flat :to="menuItem.link">{{menuItem.title}}</v-btn></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sideNav: false,
      menuItems: [{
        icon: 'supervisor_account',
        title: 'View Meetups',
        link: '/meetups'
      },
      {
        icon: 'room',
        title: 'Organize Meetup',
        link: '/meetups/new'
      },
      {
        icon: 'person',
        title: 'Profile',
        link: '/profile'
      },
      {
        icon: 'face',
        title: 'Sign Up',
        link: '/signup'
      },
      {
        icon: 'lock_open',
        title: 'Sign In',
        link: '/signin'
      }]
    }
  },
  methods: {
    onTileClick() {
    }
  }
}
</script>

<style lang="stylus">
@require './stylus/theme';
@require './stylus/main';
</style>