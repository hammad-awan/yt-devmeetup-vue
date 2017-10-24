<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm16 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignUp">
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
                    <v-text-field id="confirmPassowrd" name="confirmPassowrd" label="Confirm Password" type="password" 
                    v-model="confirmPassword" required :rules="[comparePasswords]">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" primary>Sign Up</v-btn>
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
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    onSignUp() {
      this.$store.dispatch('signUpUser', {
        email: this.email,
        password: this.password
      })
    }
  },
  computed: {
    comparePasswords() {
      if (this.password !== this.confirmPassword) {
        return 'Passwords do not match'
      }
      return true
    },
    user() {
      return this.$store.getters.user
    }
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push({ name: 'Home' })
      }
    }
  }
}
</script>

<style scoped>

</style>