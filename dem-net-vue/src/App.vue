<template>
  <div id="app">
        <b-navbar>
          <template slot="brand">
              <b-navbar-item href="/">
                  <router-link to="/">
                    <img src="./assets/DEMnet_logo_long.png" alt="DEM Net Elevation API" width="60" />
                  </router-link>
              </b-navbar-item>
          </template>
          <template slot="start">
            <b-navbar-item tag="router-link" :to="{ name: 'home' }">
                      Home
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'Playground3DGpx' }">
                      GPX to 3D
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'Playground3DBbox' }">
                    Map to 3D
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'FAQ' }">
                    FAQ
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'About' }">
                  About
              </b-navbar-item>
          </template>

          <template slot="end">
              <b-navbar-item tag="div">
                  <div class="buttons">
                    <a class="button" href="https://github.com/dem-net/DEM.Net" target="_blank" rel="noopener noreferrer">
                      <span class="icon is-small">
                        <i class="fab fa-github"></i>
                      </span>
                    </a>
                    <a class="button" href="https://join.slack.com/t/dem-net/shared_invite/enQtNjAxOTE3NTcwMDY1LWJjZDRmMzAxZDI3YzM3MWVjMzAzNjY4NDFkMWM3MmViN2E1YzI5OWM2ZDEyYmZlNWUyYmYzMjJlYThlNTU3ZWI" target="_blank" rel="noopener noreferrer">
                      <span class="icon is-small">
                        <i class="fab fa-slack"></i>
                      </span>
                    </a>
                    <a class="button" href="https://twitter.com/elevationapi" target="_blank" rel="noopener noreferrer">
                      <span class="icon is-small">
                        <i class="fab fa-twitter"></i>
                      </span>
                    </a>
                  </div>
              </b-navbar-item>
          </template>
        </b-navbar>

      <!-- Hero content: will be in the middle -->
      <div class="hero-body">
        
        <div class="container has-text-centered"> 
         
          <b-notification v-if="initErrors" :active.sync="initErrors"
            type="is-warning"
            has-icon
            icon-pack="fas"
            aria-close-label="Close notification"
            role="alert">
            Application cannot connect to back-end server. Please try again later by refreshing this page.
        </b-notification>
          <router-view />
        </div>
      </div>

      <footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>DEM-Net Elevation API</strong> by <a href="https://twitter.com/XavierFischer">Xavier Fischer</a>. The source code is licensed
      <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      
    </p>
    <div class="columns">
      <div class="column">
        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8F428QPSP9W5E&source=url">
          <img src="https://raw.githubusercontent.com/dem-net/Resources/master/images/ext/paypal-donate.png" alt="Donate with PayPal button" width="150">
        </a>
      </div>

      <div class="column">
        <a href="https://www.patreon.com/bePatron?u=24134737">
          <img src="https://raw.githubusercontent.com/dem-net/Resources/master/images/ext/become_a_patron_button@2x.png" alt="Become a Patron" width="150">
        </a>
      </div>
      <div class="column">
        <!-- Place this tag where you want the button to render. -->
        <gh-btns-star slug="dem-net/DEM.Net" show-count></gh-btns-star>
      </div>    
    </div>
  </div>
</footer>
  </div>
</template>
<script>


export default {
  name: 'app',
  created() {
    this.$store.dispatch('datasets/getDatasets');
    this.$store.dispatch('imagery/getProviders');
  },
  computed: {
    initErrors() {
      if (this.$store.state.datasets.initErrors
        || this.$store.state.imagery.initErrors)
      return true;
      else
      return false;
    }
  }
}
</script>



<style>
.dem-nav-inactive {
  color: #4a4a4a;
}
a.dem-nav-active {
  color: #896bda;
}
</style>
