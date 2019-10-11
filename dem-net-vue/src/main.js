import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import axios from 'axios'

// GitHub buttons
import VueGitHubButtons from 'vue-github-buttons'
import 'vue-github-buttons/dist/vue-github-buttons.css';
Vue.use(VueGitHubButtons);

// Leaflet
import { LMap, LTileLayer, LMarker, LControl, LFeatureGroup } from 'vue2-leaflet';
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

// Vue Babylon
import vb from 'vue-babylonjs';
Vue.use(vb);

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-control', LControl);
Vue.component('l-featuregroup', LFeatureGroup);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import elevationHub from './elevation-hub';
Vue.use(Buefy)

Vue.config.productionTip = false

const isProd = process.env.NODE_ENV === 'production'

// Setup axios as the Vue default $http library
axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL
Vue.prototype.$http = axios

// SignalR
Vue.use(elevationHub)

// Google Analytics
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-146878037-1',
  router,
  autoTracking: {
    exception: true
  },
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
