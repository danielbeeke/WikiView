import {GeoJsonDataProvider} from '@here/harp-geojson-datasource';
import {MapControls} from '@here/harp-map-controls';
import {MapView} from '@here/harp-mapview';
import {APIFormat, OmvDataSource} from '@here/harp-omv-datasource';
import {token} from '../../config';
import {sphereProjection} from "@here/harp-geoutils";
import style from '../map-style.json';

export class AframeHarpGlobe {

  // Real live size of globe.
  private earthSize = 6371000;

  private mapView: any;
  private omvDataSource: any;
  private geoJsonDataSource: any;
  private geoJsonDataProvider: any;
  private aframeElement: any;

  constructor(aframeName, aframeElement) {
    this.aframeElement = aframeElement;
    const sceneCanvas = aframeElement.sceneEl.canvas;
    const canvas = document.createElement('canvas');
    canvas.width = sceneCanvas.width;
    canvas.height = sceneCanvas.height;
    const factor = 1 / this.earthSize;

    // @ts-ignore
    window.sync = () => this.syncCameras();

    this.mapView = new MapView({
      canvas: canvas,
      // @ts-ignore
      theme: style,
      // synchronousRendering: true,
      projection: sphereProjection,
      decoderUrl: 'decoder.bundle.js'
    });

    this.globe.scale.set(factor, factor, factor);
    this.globe.position.set(3,0,0);
    aframeElement.setObject3D(aframeName, this.globe);

    this.omvDataSource = new OmvDataSource({
      baseUrl: 'https://xyz.api.here.com/tiles/herebase.02',
      apiFormat: APIFormat.XYZOMV,
      styleSetName: 'tilezen',
      maxZoomLevel: 17,
      authenticationCode: token
    });

    this.mapView.addDataSource(this.omvDataSource);

    MapControls.create(this.mapView);

    this.mapView.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => this.mapView.resize(window.innerWidth, window.innerHeight));
    this.geoJsonDataProvider = new GeoJsonDataProvider(
      "markers",
      {
        "type": "FeatureCollection",
        "features": []
      }
    );

    this.geoJsonDataSource = new OmvDataSource({
      dataProvider: this.geoJsonDataProvider,
      styleSetName: "geojson"
    });

    this.mapView.addDataSource(this.geoJsonDataSource).then(() => {
      const styles: any = [{
        "when": [
          "all",
          ["==", ["get", "$geometryType"], "point"],
          ["==", ["get", "visible"], true]
        ],
        "technique": "circles",
        "renderOrder": 10000,
        "attr": {
          "color": "#5e0801",
          "size": 5
        }
      }];

      this.geoJsonDataSource.setStyleSet(styles);
      this.mapView.update();
    });

    setTimeout(() => {
      this.syncCameras();
    }, 200);
  }

  /**
   * Set a geojson feature.
   * @param GeoJSONFeatureCollection
   */
  setMarkers (GeoJSONFeatureCollection: any) {
    this.geoJsonDataProvider.updateInput(GeoJSONFeatureCollection);
    this.mapView.update();
  }

  get globe () {
    return this.mapView.worldRootObject;
  }

  get harpCamera () {
    return this.mapView.camera;
  }

  get aframeCamera () {
    return this.aframeElement.sceneEl.camera;
  }

  syncCameras () {
    console.log(this.harpCamera, this.aframeCamera)
  }

}

