## What are STL and GLTF/GLB file formats?

- [STL](https://en.wikipedia.org/wiki/STL_(file_format)) is for 3D printing. It cannot be textured and does not support color in DEM Net.
- [glTF](https://en.wikipedia.org/wiki/GlTF) is an open standard for 3D asset exchange. It supports Physical Base Rendering and is awesome.
<br/>DEM Net uses binary-packed glTF files (.glb), where geometry and textures are encoded in a single file.

## How can I see my model once downloaded ?

| File format |    OS   | Viewers                                                       |
|-------------|:-------:|---------------------------------------------------------------|
| STL, GLB    | Windows < 10 | I recommend [glTF Viewer](https://gltf-viewer.donmccurdy.com)                                          |
| STL, GLB    | Windows 10+ | Native 3D Viewer app                                          |
| STL         |  MacOS  | Native "Preview" app or space bar                                                 |
| GLB         |  MacOS/Linux  | I recommend [glTF Viewer](https://gltf-viewer.donmccurdy.com) |

> For STL models visualization I also like [Ultimaker Cura](https://ultimaker.com/software/ultimaker-cura), it is indeed recommended for 3D printing as well.


## Do I need to give attribution to DEM Net Elevation API?

- You MUST cite the data sources
    - Elevation data providers (OpenTopography or NOOA for ETOPO1)
    - Imagery providers

__You'll find in the [About page](/about#imagery) all needed information to credit them. It's open and free data, that's awesome, give them all the credit they deserve.__

- You MUST also cite "DEM Net Elevation API (elevationapi.com)" for all derived work. I have spent many (I mean, MANY) hours of my spare time building this and you should give me the credit for what I've built thanks to open data and [other people's work](https://github.com/dem-net/DEM.Net/blob/master/LICENSE%20-%20ThirdParty.md).

## Are the models georeferenced, how can I integrate them?

- Models coordinates are projected to Web Mercator (3857). Units are in meters.

- __One important note__: after projection, model are centered on (0,0,0).
We plan to update this, for easier model integration with real-world data.

## How can I share my model?

- The best way (for now) is to upload it to [SketchFab](https://sketchfab.com), where you can setup the camera and 3D post processing effects, and share your model. See [DEM Net Elevation API gallery](https://sketchfab.com/xfischer).

## Can I run _simple_ elevation data requests?

- Yes! This site is a user facing playground to use the advanced 3D features of the API, but there are basic elevation APIs here : [api.elevationapi.com](https://api.elevationapi.com)

> This URL will give you (quickly!) the elevation near Notre-Dame de Paris (39 meters), using SRTM GL3 dataset :
<br/>
> [https://api.elevationapi.com/api/Elevation?lat=48.854624&lon=2.3436793&dataSet=SRTM_GL3](https://api.elevationapi.com/api/Elevation?lat=48.854624&lon=2.3436793&dataSet=SRTM_GL3)

## Is it really free?

- No. It is free for personal use, or for small business companies (<100K$ gross revenue).

- __**We do not allow**__ > 100K$ gross revenue companies to use our API without prior notice and approval from contact@elevationapi.com.

__This site's back-end has a running cost of 100€ / month__. Please consider supporting the project via a Paypal donation or by being a Patron on Patreon.

## Is there limits in API usage?

Yes, there's a rate limit on API endpoints to encourage respectful usage and resource sharing among all users.

- Model generation: 1 call every 5 second.
- Line elevation: 1 call per second.
- Other endpoints: 3 calls per second.

## Will other datasets be added in the future?

Yes! We plan to add other global datasets:
- ASTER GDEM V3
- MapBox Elevation Tiles

## What are the forthcoming features?

- Better 3D visualization
- Ambient occlusion textures
- Better TIN generation
- RTIN implementation
- Dual DEM generation (simple mesh / complex normal map)
- Texture compression
- ...

## Can I use this in my own software?

- OK for individuals or small businesses (< 100 K$ gross revenue)
- 100K+ gross revenue companies, please contact us.

## Where the elevation data comes from and what is the coverage area?

DEM Net uses publicly available DEMs from [OpenTopography](https://opentopography.org/) and [NOOA](https://www.ngdc.noaa.gov/mgg/global).

* __ETOPO1__ has global coverage, including oceans. Resolution: approx 2km.
<br/>*This dataset is best for large areas and bathymetry. It offers a great simplification of elevations*.

* **ALOS World 3D (AW3D30)** dataset coverage is within approx. 82 deg. of N/S latitudes. Resolution: 30m.<br/>*This dataset has the better detail, but contains a lot of void areas with no data. In those cases, use SRTM_GL1 as a backup plan.*

* **SRTM** dataset coverage is within approx. 60 deg. of N/S latitudes. Resolution: 30m for SRTM_GL1 and 90m SRTM_GL3.<br/>*This dataset has no or very few voids. But it appears more smoothed than the ALOS World 3D.*

## Can I use another imagery service ?

It is possible if the provider is a tile ZXY provider (no WMS), is public (ie: public facing URL), and if it can be freely usable. Please contact us via contact@elevationapi.com.

## How is this working?

Coming soon...