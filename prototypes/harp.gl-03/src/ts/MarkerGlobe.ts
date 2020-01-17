import {GeoJsonDataProvider} from '@here/harp-geojson-datasource';
import {MapControls} from '@here/harp-map-controls';
import {MapView} from '@here/harp-mapview';
import {APIFormat, OmvDataSource} from '@here/harp-omv-datasource';
import {token} from '../../config';
import { sphereProjection } from "@here/harp-geoutils";
import style from '../map-style.json';

export class MarkerGlobe {

  private mapView: any;
  private omvDataSource: any;
  private geoJsonDataSource: any;
  private geoJsonDataProvider: any;

  constructor(canvas) {
    this.mapView = new MapView({
      canvas: canvas,
      // @ts-ignore
      theme: style,
      // synchronousRendering: true,
      projection: sphereProjection,
      decoderUrl: 'decoder.bundle.js'
    });

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
  }

  /**
   * Set a geojson feature.
   * @param GeoJSONFeatureCollection
   */
  setMarkers (GeoJSONFeatureCollection: any) {
    this.geoJsonDataProvider.updateInput(GeoJSONFeatureCollection);
    this.mapView.update();
  }

  get3dObject () {
    return this.mapView.worldRootObject;
  }

  getCamera () {
    return this.mapView.camera;
  }

  getMap () {
    return this.mapView;
  }

}

