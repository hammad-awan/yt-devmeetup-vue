<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" v-if="error">
          {{error.message}}
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="signIn">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field id="email" name="email" label="Email" type="email" v-model="email" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field id="password" name="password" label="Password" type="password" v-model="password" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" color="primary" :loading="signingIn" @click.native="loader = 'signingIn'" :disabled="signingIn">
                      Sign In
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      signingIn: false,
      error: null
    }
  },
  methods: {
    async signIn() {
      try {
        this.error = null
        this.signingIn = true
        await this.$store.dispatch('signIn', {
          email: this.email,
          password: this.password
        })
      } catch (error) {
        this.error = error
      } finally {
        this.signingIn = false
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
    isUserAuthenticated(value) {
      if (value) {
        this.$router.push({ name: 'Home' })
      }
    }
  }
}
</script>

<style scoped>

</style>