import {token} from './config.ts';

const map = new harp.MapView({
  canvas: document.getElementById("map"),
  projection: harp.sphereProjection,
  theme: "style.json",
});
const controls = new harp.MapControls(map);
const omvDataSource = new harp.OmvDataSource({
  baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
  apiFormat: harp.APIFormat.XYZOMV,
  styleSetName: "tilezen",
  authenticationCode: token,
});
map.addDataSource(omvDataSource);


  let query = `SELECT DISTINCT ?sitelink (SAMPLE(?itemLabel) AS ?title) (SAMPLE(?point_in_time) AS ?date) (SAMPLE(?geo) AS ?lat_lng) WHERE {
      ?item ((wdt:P31*)/(wdt:P279*)) wd:Q178561;
        wdt:P625 ?geo;
        wdt:P585 ?point_in_time.
        ?item rdfs:label ?itemLabel. 
      filter(lang(?itemLabel) = 'en')
      ?sitelink schema:about ?item;
        schema:inLanguage "en";
        schema:isPartOf <https://en.wikipedia.org/>.
    }
    GROUP BY ?sitelink`;
  fetch('https://query.wikidata.org/sparql?query=' + query, {
    headers: { Accept: 'application/sparql-results+json' },
  })
    .then(response => response.json())
    .then(response => {
      let markers = response.results.bindings.map(item => {
        let latLng = item.lat_lng.value.replace('Point(', '').replace(')', '').split(' ');

        return {
          "type": "Feature",
          "properties": {
            "name": "Coors Field",
            "url": item.sitelink.value,
            "date": item.date.value
          },
          "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(latLng[0]), parseFloat(latLng[1])]
          }
        }
      });


      const geoJsonDataProvider = new harp.GeoJsonDataProvider(
        "markers",
        {
          "type": "FeatureCollection",
          "features": markers
        }
      );

      const geoJsonDataSource = new harp.OmvDataSource({
        dataProvider: geoJsonDataProvider,
        styleSetName: "geojson"
      });

      map.addDataSource(geoJsonDataSource).then(() => {
        const styles = [{
          "when": "$geometryType == 'point'",
          "technique": "circles",
          "renderOrder": 10000,
          "attr": {
            "color": "#5e0801",
            "size": 15
          }
        }];

        geoJsonDataSource.setStyleSet(styles);
        map.update();
      });
    });
}

function handlePick(mapViewUsed, x, y) {
  let usableIntersections = mapViewUsed.intersectMapObjects(x, y)

  console.log(usableIntersections)

}

document.getElementById("map").addEventListener("mousedown", event => {
  handlePick(map, event.pageX, event.pageY);
});