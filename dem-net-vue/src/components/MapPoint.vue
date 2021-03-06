<template>
  <section>
    <div class="columns">
      <div class="column">
        <!-- Map -->
        <l-map
          ref="map"
          id="map"
          :zoom="zoom"
          :center="center"
          @click="mapClick"
          :options="{worldCopyJump: true}"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-if="marker"
            :lat-lng="markerLocation"
            draggable
            @drag="markerMoved"
            @dragend="markerMovedEnd"
          ></l-marker>
        </l-map>
      </div>
      <!-- Dataset selection and results -->
      <div class="column">
        <section class="is-large">
          <DatasetSelector :dataSet="this.dataSet" @datasetSelected="onDatasetSelected" />
        </section>
        <div class="box">
          <section class="is-large">
            <b-loading :is-full-page="isLoaderFullPage" :active.sync="isBusy" :can-cancel="false">
              <b-notification :closable="false">
                
                <section class="section has-text-centered">
                <b-icon pack="fas" icon="spinner" size="is-large" custom-class="fa-spin"></b-icon>
                </section>
                <section class="section has-text-centered">
                Server is downloading requested DEM tile...
                </section>
              </b-notification>
            </b-loading>
            <ElevationResult :elevation="this.markerLocationResult"></ElevationResult>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
//import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
//import leafletdraw from "leaflet-draw";
import ElevationResult from "@/components/ElevationResult.vue";
import DatasetSelector from "@/components/DatasetSelector.vue";

export default {
  name: "MapPoint",
  components: { LMap, LTileLayer, LMarker, ElevationResult, DatasetSelector },

  mounted() {
    this.$nextTick(() => {
      //var localM = this.$refs.map.mapObject;//.L.latLng(47.41322, 1.219482);
    });
  },
  methods: {
    mapClick(e) {
      this.$store.commit("points/setSinglePointLocation", e.latlng);
      this.marker = e.latlng;

      var payload = { location: e.latlng, dataset: this.selectedDataSet };
      this.$store.dispatch("points/getSinglePointElevation", payload);
    },
    markerMoved(e) {
      this.marker = e.latlng;
    },
    markerMovedEnd() {
      this.$store.commit("points/setSinglePointLocation", this.marker);
      var payload = { location: this.marker, dataset: this.selectedDataSet };
      this.$store.dispatch("points/getSinglePointElevation", payload);
    },
    onDatasetSelected(dstName) {
      if (this.marker) {
        this.dataSet = dstName;
        var payload = { location: this.marker, dataset: this.selectedDataSet };
        this.$store.dispatch("points/getSinglePointElevation", payload);
      }
    }
  },
  computed: {
    markerLocation() {
      return this.$store.state.points.singlePointLocation;
    },
    markerLocationResult() {
      return this.$store.state.points.singlePointLocationElevationResult;
    },
    selectedDataSet: function() {
      return this.dataSet;
    },
    isBusy() {
      return this.$store.state.points.clientBusy;
    }
  },
  data() {
    return {
      zoom: 5,
      center: [45.75583, 3.61778],
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      marker: null,
      isActive: true,
      isLoaderFullPage: true,
      dataSet: "SRTM_GL3"
    };
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  margin: 0;
}
</style>