import '../../scss/style.scss';
import {WikiDataSparql} from './WikiDataSparql';
import {battlesQuery} from './SparqlQueries';
import {MarkerGlobe} from './MarkerGlobe';

const canvas = document.createElement('canvas');
canvas.id = 'map';
document.body.appendChild(canvas);

let map = new MarkerGlobe(canvas);
let wikiData = new WikiDataSparql();

wikiData.get(battlesQuery).then(GeoJSONFeatureCollection => {
  GeoJSONFeatureCollection.features.forEach(feature => {
    // @ts-ignore
    feature.properties.visible = false;
  });

  map.setMarkers(GeoJSONFeatureCollection);

  setTimeout(() => {
    // @ts-ignore
    GeoJSONFeatureCollection.features.forEach(feature => {
      // @ts-ignore
      feature.properties.visible = true;
    });
    map.setMarkers(GeoJSONFeatureCollection);

    setTimeout(() => {
      // @ts-ignore
      GeoJSONFeatureCollection.features.forEach(feature => {
        // @ts-ignore
        feature.properties.visible = false;
      });
      map.setMarkers(GeoJSONFeatureCollection);
    }, 4000)
  }, 4000)
});

