/* eslint-disable */
<template>
  <div id="app">
    <router-view @switch-lang="switchLang"/>
  </div>
</template>

<script>

export default {
  created: function () {
    this.$router.push('/en')
  },
  name: 'app',
  data() {
    return {
      lang: 0
    }
  },
  components: {

  },
  methods: {
    switchLang() {
      if (this.lang) {
        this.$router.push('/en')
        this.lang = 0
      } else {
        this.$router.push('/zh')
        this.lang = 1
      }
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');
</style>
