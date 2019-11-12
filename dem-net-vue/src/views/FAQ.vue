<template>
               
  <div class="docs-main has-text-left	">
      <div class="docs-main-container">
          <header class="docs-header">
            <h1 class="title">FAQ</h1>
            <h2 class="subtitle">You'll find here some answers to common questions. 
              If you need more info, we're on <a href="https://twitter.com/ElevationApi" target="_blank" rel="noopener noreferrer">Twitter</a> and 
              <a target="_blank" rel="noopener noreferrer" href="https://join.slack.com/t/dem-net/shared_invite/enQtNjAxOTE3NTcwMDY1LWJjZDRmMzAxZDI3YzM3MWVjMzAzNjY4NDFkMWM3MmViN2E1YzI5OWM2ZDEyYmZlNWUyYmYzMjJlYThlNTU3ZWI">Slack</a>.</h2>
        </header>


        <hr class="is-medium">

        <div class="content">
          <FaqMd></FaqMd>
      </div>
      
      </div>

      
  </div>
</template>

<script>
import FaqMd from '@/components/faq.md'

export default {
  name: 'FAQ',
  components: { FaqMd },
  data() {
        return {
         
      }
    }
}
</script>
<style scoped>
a { text-decoration: unset; text-decoration: underline; }
</style>
