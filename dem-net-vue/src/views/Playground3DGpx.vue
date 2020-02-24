<template>
  <div class="playground">
    
    <div class="container is-fluild">
    <h1 class="title">3D terrain model from GPX</h1>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Upload a GPX file&nbsp;>&nbsp;Choose your options&nbsp;>&nbsp;Generate and see the 3D model.</p>
      </header>
      <div class="card-content">  
        <div class="content">
          <section>
            <nav class="level">
            <b-field class="file level-item">
                <b-upload v-model="gpxFile">
                    <a class="button is-primary">
                        <b-icon pack="fas" icon="file-upload"></b-icon>
                        <span>Choose your GPX...</span>
                    </a>
                </b-upload>
                <span class="file-name" v-if="gpxFile">
                    {{ gpxFile.name }}
                </span>
            </b-field>
            </nav>

            <div class="columns">
              <div class="column">
                <DatasetSelector :dataSet="this.requestParams.dataSet" @datasetSelected="onDatasetSelected"/>
              </div>
              <!-- Export format -->
              <div class="column">
                <label class="label">Model output format</label>
                <b-field>
                  
                    <b-radio-button v-model="requestParams.format" native-value="glTF">Binary glTF</b-radio-button>
                    <b-radio-button v-model="requestParams.format" native-value="STL">STL (3D printer)</b-radio-button>
                  </b-field>
              </div>
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
              <!-- TIN -->
              <div class="column" v-show="false">
                <b-field label="Generate TIN" v-if="this.requestParams.format == 'glTF'">
                    <b-switch v-model="requestParams.generateTIN">
                    </b-switch>
                </b-field>
              </div>
              <!-- 3D track -->
              <div class="column">
                <b-field label="3D track">
                    <b-tooltip :label="track3Ddescription"
                        position="is-bottom" type="is-light"
                        animated multilined>
                        <b-switch v-model="requestParams.track3D">
                    </b-switch>
                    </b-tooltip>
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
                    <b-button @click="upload" :disabled="!gpxFile" icon-pack="fas" icon-left="fas fa-globe-americas">
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
                    <b-button icon-pack="fas" icon-left="fas fa-download"  :disabled="!this.glbFile">
                      <a :disabled="!this.glbFile" :href="this.glbFile" @click="modelDownload">
                        Download model
                      </a>
                    </b-button>
                    
                  </div>
                </div>
              </nav>
            <p>
                  <b-progress v-show="serverProgress" :value="serverProgressPercent" size="is-large" :type="progressType"  show-value>
                  <span style="color: black">{{ serverProgress }}</span>
              </b-progress>
            </p>
            <div class="glbcontent">
              <Scene>
                  <Camera type="arcRotate" :radius="7.5" :beta="Math.PI / 3"></Camera>
                  <HemisphericLight></HemisphericLight>
                  <Asset :src="glbFile" v-if="glbFile && this.requestParams.format == 'glTF'"  :scaling="[0.02, 0.02, 0.02]" :position="[4, 0.5, 0]"></Asset>
                  
                </Scene>
              <!-- <model-gltf :content="glbFile"></model-gltf> 
              <model-gltf
            background-color="#f0f0ff" :src="glbFile" v-if="glbFile && this.requestParams.format == 'glTF'" :rotation="rotation" @on-load="onLoad"></model-gltf>
            <model-stl
            background-color="#f0f0ff" :src="glbFile" v-if="glbFile && this.requestParams.format == 'STL'" :rotation="rotation" @on-load="onLoad"></model-stl>
            -->
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
import DatasetSelector from '../components/DatasetSelector'
import ImagerySelector from '../components/ImagerySelector'
import { Asset, Camera, Scene, HemisphericLight } from 'vue-babylonjs';

export default {
  name: 'Playground3DGpx',
  components: { DatasetSelector,ImagerySelector,Asset,Camera, Scene, HemisphericLight },
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
        gpxFile: null,
        glbFile: null,
        demoGpxFile: null,
        demErrors: null,   demErrorsActive: false,
        serverProgress: null, serverProgressPercent: 0,
        rotation: {
                x: 0,
                y: 0,
                z: 0,
            },
        enableRotation: false,
        requestParams: {
          dataSet: "SRTM_GL3",
          textured: true,
          generateTIN: false,
          imageryProvider: "Esri.WorldImagery",
          textureQuality: 2,
          format: "glTF",
          zFactor: 1,
          track3D: true
        },
        textureFiles: {
          heightMap: null,
          normalMap: null,
          albedo: null
        }
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
    },
    track3Ddescription() {
      return "If activated, GPX will we translated to a plane mesh, otherwise GPX track will be drawn on texture.";
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
    onProviderSelected(providerName) {
      this.requestParams.imageryProvider = providerName;
    },
    onQualitySelected(quality) {
      this.requestParams.textureQuality = quality;
    },
    loadDemoFile() {
      this.gpxFile = this.demoGpxFile;
      //upload();
    },
    upload(){
      this.isLoading = true;
      this.$ga.event({
        eventCategory: 'model',
        eventAction: 'generate',
        eventLabel: 'gpx-' + this.requestParams.format
      })
      this.demErrors = null;
      this.serverProgress = "Sending request...";
      const baseUrl = process.env.VUE_APP_API_BASEURL
      let formData = new FormData();
      formData.append('file', this.gpxFile);
      axios.post("/api/model/3d/gpx?dataset=" + this.requestParams.dataSet 
                                    + "&generateTIN=" + this.requestParams.generateTIN
                                    + "&textured=" + this.requestParams.textured
                                    + "&imageryProvider=" + this.requestParams.imageryProvider 
                                    + "&textureQuality=" + this.requestParams.textureQuality
                                    + "&track3D=" + this.requestParams.track3D
                                    + "&format=" + this.requestParams.format
                                    + "&zFactor=" + this.requestParams.zFactor
                                    + "&clientConnectionId=" + this.$connectionId,
      //axios.post("/api/elevation/gpx/glb?dataset=AW3D30&generateTIN=false&textured=true",
      formData,
      {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Content-Encoding': 'gzip'
          }
      }
      ).then(result => {
          var assetInfo = result.data.assetInfo;
          this.glbFile = baseUrl + assetInfo.modelFile;
          this.textureFiles.heightMap = assetInfo.heightMap ? process.env.VUE_APP_API_BASEURL + assetInfo.heightMap.filePath : null;
          this.textureFiles.albedo = assetInfo.albedoTexture ? process.env.VUE_APP_API_BASEURL + assetInfo.albedoTexture.filePath : null;
          this.textureFiles.normalMap = assetInfo.normalMapTexture ? process.env.VUE_APP_API_BASEURL + assetInfo.normalMapTexture.filePath : null;
          this.demErrors = null; this.demErrorsActive = false;
     })
      .catch(err=> {
          this.isLoading = false;
          this.serverProgress = "Request aborted"; 
          this.demErrors = err.response ? err.response.data : err.message;
          this.demErrorsActive = true;
      })
    },
    modelDownload(){
      this.$ga.event({
            eventCategory: 'model',
            eventAction: 'download',
            eventLabel: 'gpx'
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
