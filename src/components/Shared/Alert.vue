<template>
  <v-alert error dismissible @input="onClose" :value="true">
    <slot></slot>
  </v-alert>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    onClose() {
      this.$emit('dismissed')
    }
  }
}
</script>