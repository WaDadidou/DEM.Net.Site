<template>
               
  <div class="docs-main has-text-left	">
      <div class="docs-main-container">
         

        <!-- models -->
        <h1 class="title">Model formats</h1>
        <div class="content">
          <p>
              Models are available in the following formats:
              <ul>
              <li>Binary packed glTF (GLB files) : 3D open format for model exchange and transfer. Supported by major software and viewers.</li>
              </ul>
              <ul>
              <li>STereo Lithography (STL files) : 3D open format for model printing. Supported by all 3D printers, but does not support colors.</li>
              </ul>
              <ul>
              <li>3D printers with colored models soon...</li>
              </ul>
          </p>
      </div>

      <!-- models -->
        <h1 class="title">A word from the author</h1>
        <div class="content">
          <p>
              Hi! I'm Xavier Fischer a developer from France. DEM-Net was created in 2018. I wanted to get elevation profiles using my stack: Microsoft .Net.
          </p>
          <p>
              It rapidly became a great opportunity to explore Digital Elevation Models and build an Open API for elevation requests, and it led me to 3D quite fast: generating 3D models from real data.
          </p>
          <p>
              Then, with enthusiasm contagion I called for help Frederic Aubin, who helped me with Triangle Irregular Networks (TIN)) generation, and added this great brick to DEM-Net for geomorphology purposes.
          </p>
          
        <h2 class="subtitle">Contributing</h2>
        <p>All contributions welcome! We're on GitHub. For the moment, only the core library and samples are open source.
          <br/>Server and front end projects are not public yet.</p>
      </div>



        <hr class="is-medium">

        <!-- Datasets -->
        <h1 class="title">Datasets information</h1>
        <article class="content">
          <p><strong>Access to data provided by the OpenTopography Facility with support from the National Science Foundation under NSF Award Numbers 1833703, 1833643, and 1833632.
          </strong><a href="https://opentopography.org/" target="_blank" rel="noopener noreferrer">opentopography.org</a></p>
          <p><strong>ETOPO1 data: Amante, C. and B.W. Eakins, 2009. ETOPO1 1 Arc-Minute Global Relief Model: Procedures, Data Sources and Analysis. NOAA Technical Memorandum NESDIS NGDC-24. National Geophysical Data Center, NOAA. doi:10.7289/V5C8276M [2019].
            </strong><a href="https://www.ngdc.noaa.gov/mgg/global/" target="_blank" rel="noopener noreferrer">www.ngdc.noaa.gov</a></p>
          <b-table
            ref="tableDatasets"
            :data="this.availableDatasets ? this.datasets : []"
            :bordered="isBordered"
            :striped="isStriped"
            :narrowed="isNarrowed"
            :hoverable="isHoverable"
            :loading="isLoading"
            :focusable="isFocusable"
            :mobile-cards="hasMobileCards"
            detailed
            detail-key="name">
              <template slot-scope="props">
                <b-table-column field="name" label="Dataset name" width="40">
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column field="description" label="Description">
                    {{ props.row.description }}
                </b-table-column>

                <b-table-column field="resolutionMeters" label="Resolution (m)" numeric>
                    {{ props.row.resolutionMeters }}
                </b-table-column>
                
                <b-table-column field="source" label="Source">
                    <a :href="props.row.attribution.url">{{ props.row.attribution.text }}</a>
                </b-table-column>

                <b-table-column field="attribution.acknowledgement" label="Acknowledgements">
                   <a @click="toggleDatasets(props.row)">
                            Click for details
                        </a>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
              <div class="media-content">
                  <div class="content">
                      <p>
                          <small>@{{ props.row.attribution.acknowledgement}}</small>
                          </p>
                  </div>
              </div>
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Nothing here.</p>
                    </div>
                </section>
            </template>
        </b-table>
        </article>

        <hr class="is-medium">

        <!-- Imagery -->
        <h1 class="title" id="imagery">Imagery providers</h1>
        <article class="content">
          <b-table
            ref="tableImagery"
            :data="this.availableImagery ? this.imageryProviders : []"
            :bordered="isBordered"
            :striped="isStriped"
            :narrowed="isNarrowed"
            :hoverable="isHoverable"
            :loading="isLoading"
            :focusable="isFocusable"
            :mobile-cards="hasMobileCards"
            detailed
            detail-key="name">
              <template slot-scope="props">
                <b-table-column field="name" label="Name">{{ props.row.name }}
                </b-table-column>


                <b-table-column field="maxZoom" label="Zoom max" numeric>
                    {{ props.row.maxZoom }}
                </b-table-column>
                
                <b-table-column field="attribution.acknowledgement" label="Acknowledgements">
                   <a @click="toggleImagery(props.row)">
                            Click for details
                        </a>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
              <div class="media-content">
                  <div class="content">
                      <p>
                          <small>@{{ props.row.attribution.text}}</small>
                          </p>
                  </div>
              </div>
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Nothing here.</p>
                    </div>
                </section>
            </template>
        </b-table>
        </article>

      </div>
  </div>
</template>

<script>
export default {
  name: 'FAQ',
  components: {
    
  },
  created() {
    if (!this.$store.state.datasets.dataSets)
      this.$store.dispatch('datasets/getDatasets');
    if (!this.$store.state.imagery.providers)
      this.$store.dispatch('imagery/getProviders');
  },
  methods: {
      toggleImagery(row) {
          this.$refs.tableImagery.toggleDetails(row)
      },
      toggleDatasets(row) {
          this.$refs.tableDatasets.toggleDetails(row)
      }
  },
  computed: {
    availableDatasets() {
          return this.$store.state && this.$store.state.datasets && this.$store.state.datasets.dataSets;
      },
    datasets() {
      return this.$store.state.datasets.dataSets;
    },
    availableImagery() {
          return this.$store.state && this.$store.state.imagery && this.$store.state.imagery.providers;
      },
    imageryProviders() {
      return this.$store.state.imagery.providers;
    }
  }, 
  data() {
        return {
          isEmpty: false,
          isBordered: false,
          isStriped: true,
          isNarrowed: true,
          isHoverable: false,
          isFocusable: false,
          isLoading: false,
          hasMobileCards: true,
          isImageModalActive: false
            
      }
    }
}
</script>
