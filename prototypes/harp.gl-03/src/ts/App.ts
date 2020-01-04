import { GeoCoordinates } from "@here/harp-geoutils";
import {MapControls} from "@here/harp-map-controls";
import {MapView} from "@here/harp-mapview";
import {APIFormat, OmvDataSource} from "@here/harp-omv-datasource";
import {token} from "../../config";
import "../../scss/style.scss";

const canvas = document.createElement('canvas');
canvas.id = 'map';
document.body.appendChild(canvas);

const mapView = new MapView({
    canvas: canvas,
    theme: 'resources/berlin_tilezen_base.json',
    decoderUrl: "decoder.bundle.js"
});

const omvDataSource = new OmvDataSource({
    baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
    apiFormat: APIFormat.XYZOMV,
    styleSetName: "tilezen",
    maxZoomLevel: 17,
    authenticationCode: token
});

mapView.addDataSource(omvDataSource);

MapControls.create(mapView);

mapView.resize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => mapView.resize(window.innerWidth, window.innerHeight));
mapView.lookAt(new GeoCoordinates(40.70398928, -74.01319808), 1500, 40, 0);
mapView.update();
