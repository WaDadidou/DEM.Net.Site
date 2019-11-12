<template>
  <div class="playground">
    
    <div class="container is-fluild">
    <h1 class="title">3D terrain model from a map</h1>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Draw a rectangle using the tool&nbsp;>&nbsp;Choose your options&nbsp;>&nbsp;Generate and see the 3D model.</p>
      </header>
      <div class="card-content">  
        <div class="content">
          <section>
            <div class="columns">
              <div class="column">
                <MapRectangle @bboxSelected="setBbox"></MapRectangle>
              </div>
              <div class="column">
                <div class="columns">
                  <div class="column">
                    <DatasetSelector :dataSet="this.requestParams.dataSet" @datasetSelected="onDatasetSelected"/>
                  </div>
                  <!-- Export format -->
                  <div class="column">
                    <label class="label">Output format</label>
                    <b-field>
                      <b-radio-button v-model="requestParams.format" native-value="glTF">Binary glTF</b-radio-button>
                      <b-radio-button v-model="requestParams.format" native-value="STL">STL</b-radio-button>
                      </b-field>
                  </div>
                </div>
                <div class="columns">
                  <!-- Texture -->
                  <div class="column" v-show="showTextureOptions">
                    <b-field label="Use imagery texture">
                        <b-switch v-model="requestParams.textured">
                        </b-switch>
                    </b-field>
                    <ImagerySelector v-show="showTextureOptionsProvider" :provider="requestParams.imageryProvider" 
                      @providerSelected="onProviderSelected"
                      @qualitySelected="onQualitySelected"/>
                  </div>
                  <!-- Z factor -->
                  <div class="column">
                    <b-field label="Z multiplier">
                      <b-slider v-model="requestParams.zFactor" size="is-medium" :min="1" :max="10" :step=".5"></b-slider>
                    </b-field>
                  </div>
                  <!-- TIN-->
                  <div class="column" v-show="false">
                    <b-field label="Generate TIN">
                        <b-switch v-model="requestParams.generateTIN">
                        </b-switch>
                    </b-field>
                  </div>
                  <!-- rotate -->
                  <div class="column">
                    <b-field label="Rotate model">
                        <b-switch v-model="enableRotation">
                        </b-switch>
                    </b-field>
                  </div>
                </div>
              </div>
            </div>
            <b-notification v-show="demErrors" :active.sync="demErrorsActive"
                    type="is-warning"
                    has-icon
                    icon-pack="fas"
                    aria-close-label="Close notification"
                    role="alert">
                    An error occured while generating the model :
              {{ demErrors }}
              </b-notification>
              
              <!-- Buttons -->
              <nav class="level is-mobile">
                <!-- Generation -->
                <div class="level-item has-text-centered">
                  <div>
                    <b-button @click="generateModel" :disabled="!requestParams.bbox" icon-pack="fas" icon-left="fas fa-globe-americas">
                      Generate 3D model
                    </b-button>
                  </div>
                </div>
                <!-- Textures -->
                <div class="level-item has-text-centered">
                  <b-dropdown hoverable aria-role="list" :disabled="!this.glbFile">
                            <button class="button" slot="trigger">
                                <b-icon pack="fas" icon="images"></b-icon>
                                <span>Download textures</span>
                            </button>
                            <b-dropdown-item has-link aria-role="menuitem" v-if="this.textureFiles.heightMap">
                                <a :href="this.textureFiles.heightMap" target="_blank" rel="noopener noreferrer">
                                    <b-icon pack="fas" icon="image"></b-icon>
                                    Height map
                                </a>
                            </b-dropdown-item>
                            <b-dropdown-item has-link aria-role="menuitem" v-if="this.textureFiles.normalMap">
                                <a :href="this.textureFiles.normalMap" target="_blank" rel="noopener noreferrer">
                                    <b-icon pack="fas" icon="image"></b-icon>
                                    Normal map
                                </a>
                            </b-dropdown-item>
                             <b-dropdown-item has-link aria-role="menuitem" v-if="this.textureFiles.albedo">
                                <a :href="this.textureFiles.albedo" target="_blank" rel="noopener noreferrer">
                                    <b-icon pack="fas" icon="image"></b-icon>
                                    Albedo (imagery)
                                </a>
                            </b-dropdown-item>
                        </b-dropdown>
                </div>
                <!-- Download -->
                <div class="level-item has-text-centered">
                  <div>
                    <b-button icon-pack="fas" icon-left="fas fa-download" :disabled="!this.glbFile" tag="a" :href="this.glbFile" @click="modelDownload">
                        Download model
                      </b-button>
                  </div>
                </div>
              </nav>

              <p>
                <b-progress v-show="serverProgress" :value="serverProgressPercent" size="is-large" :type="progressType" show-value>
                    <span style="color: black">{{ serverProgress }}</span>
                </b-progress>
              </p>
              <div class="glbcontent">
                <Scene v-if="glbFile && this.requestParams.format == 'glTF'">
                  <Asset  :src="glbFile" :scaling="[0.00002, 0.00002, 0.00002]"></Asset>
                </Scene>
                <!-- <model-gltf :content="glbFile"></model-gltf> -->
                <model-gltf
                  background-color="#f0f0ff" :src="glbFile" v-if="glbFile && this.requestParams.format == 'glTF'" :rotation="rotation" @on-load="onLoad"></model-gltf>
              <model-stl
                  background-color="#f0f0ff" :src="glbFile" v-if="glbFile && this.requestParams.format == 'STL'" :rotation="rotation" @on-load="onLoad"></model-stl>
              </div>
            <b-loading :is-full-page="isLoadingFullPage" :active.sync="isLoading" :can-cancel="false"></b-loading>
              
          </section>
        </div>
      </div>
    </div>
    <section>
      
    </section>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ModelGltf,ModelStl } from 'vue-3d-model'
import DatasetSelector from '../components/DatasetSelector'
import ImagerySelector from '../components/ImagerySelector'
import MapRectangle from '../components/MapRectangle'

export default {
  name: 'Playground3DBbox',
  components: { ModelGltf,ModelStl,MapRectangle,DatasetSelector,ImagerySelector },
  mounted() {
    // Listen to server side progress events
    this.$elevationHub.$on('server-progress', this.onServerProgress);
    this.$elevationHub.generatorOpened()
  },
  beforeDestroy() {
    this.$elevationHub.$off('server-progress', this.onServerProgress);
    this.$elevationHub.generatorClosed()
  },
  data() {
    return {
        isLoading: false,
        isLoadingFullPage: false,
        glbFile: null,
        demErrors: null, demErrorsActive: true,
        serverProgress: null, serverProgressPercent: 0,
        rotation: {
                x: 0,
                y: 0,
                z: 0,
            },
        enableRotation: false,
        requestParams: {
          bbox: null,
          dataSet: "SRTM_GL3",
          textured: true,
          imageryProvider: "Esri.WorldImagery",
          textureQuality: 2,
          format: "glTF",
          zFactor: 1,
          generateTIN: false
        },
        textureFiles: {
          heightMap: null,
          normalMap: null,
          albedo: null
        },
        attributions: []
    }
  },
  computed: {
    showTextureOptions() {
      return (this.requestParams.format == "glTF");
    },
    showTextureOptionsProvider() {
      return (this.requestParams.format == "glTF" && this.requestParams.textured);
    },
    progressType() {
        return (this.demErrors == null) ? "is-warning" : "is-danger";
    }
  },
  methods: 
  {
    onLoad () {
        this.isLoading = false;
        this.rotate();
    },
    rotate () {
      if (this.enableRotation) {
        this.rotation.y += 0.002;
        }
        requestAnimationFrame( this.rotate );
    },
    onDatasetSelected(dstName) {
      this.requestParams.dataSet = dstName;
    },
    onQualitySelected(quality) {
      this.requestParams.textureQuality = quality;
    },
    onProviderSelected(providerName) {
      this.requestParams.imageryProvider = providerName;
    },
    setBbox(bbox) {
      this.requestParams.bbox = bbox;
    },
    generateModel(){
      this.isLoading = true;
      this.$ga.event({
        eventCategory: 'model',
        eventAction: 'generate',
        eventLabel: 'bbox-' + this.requestParams.format
      })
      this.demErrors = null;
      this.serverProgress = "Sending request...";  
      const baseUrl = process.env.VUE_APP_API_BASEURL
      axios.get("/api/model/3d/bbox/" + this.requestParams.bbox
                                    + "?dataset=" + this.requestParams.dataSet 
                                    + "&generateTIN=" + this.requestParams.generateTIN
                                    + "&textured=" + this.requestParams.textured
                                    + "&imageryProvider=" + this.requestParams.imageryProvider 
                                    + "&textureQuality=" + this.requestParams.textureQuality
                                    + "&format=" + this.requestParams.format
                                    + "&zFactor=" + this.requestParams.zFactor
                                    + "&clientConnectionId=" + this.$connectionId
      ).then(result => {
          var assetInfo = result.data.assetInfo;
          this.glbFile = baseUrl + assetInfo.modelFile;
          this.textureFiles.heightMap = assetInfo.heightMap ? process.env.VUE_APP_API_BASEURL + assetInfo.heightMap.filePath : null;
          this.textureFiles.albedo = assetInfo.albedoTexture ? process.env.VUE_APP_API_BASEURL + assetInfo.albedoTexture.filePath : null;
          this.textureFiles.normalMap = assetInfo.normalMapTexture ? process.env.VUE_APP_API_BASEURL + assetInfo.normalMapTexture.filePath : null;
          this.attributions = assetInfo.attributions; 
          this.demErrors = null; this.demErrorsActive = false;
      })
      .catch(err=> { 
          this.isLoading = false;
          this.serverProgress = "Request aborted";  
          this.demErrors = err.response.data; 
          this.demErrorsActive = true;
          })
    },
    modelDownload(){
      this.$ga.event({
            eventCategory: 'model',
            eventAction: 'download',
            eventLabel: 'bbox'
          })
    },
    onServerProgress({message, percent}) {
      this.serverProgress = message;
      this.serverProgressPercent = percent;
    }
  }
} 
</script>

<style scoped>
.glbcontent {
    height: 100%;
    width: 100%;
}
</style>
