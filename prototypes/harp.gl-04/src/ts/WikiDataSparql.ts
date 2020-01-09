interface SparqlResponse {
  head: object;
  results: { bindings: Array<object> };
}

/**
 * Fetches a sparql query and returns it as a specific Geojson format for our application.
 */
export class WikiDataSparql {

  /**
   * Returns uniform data from a sparql query.
   * @param query
   */
  public get(query) {
    return fetch('https://query.wikidata.org/sparql?query=' + query, {
      headers: { Accept: 'application/sparql-results+json' },
    })
      .then(response => response.json())
      .then(response => {
        const mapping = this.createMapping(response);
        this.validateResponse(response, mapping);
        return this.responseToGeoJson(response, mapping);
      });
  }

  /**
   * Creates a mapping from the response and the field types.
   * @param response
   */
  private createMapping (response: SparqlResponse) {
    let mapping = {
      date: null,
      string: null,
      wkt: null,
      uri: null
    };

    const firstResult = response.results.bindings[0];

    for (const [fieldName, fieldData] of Object.entries(firstResult)) {
      if (fieldData.type === 'uri') { mapping.uri = fieldName }
      if (fieldData.type === 'literal' && !fieldData.datatype) { mapping.string = fieldName }
      if (fieldData.datatype && fieldData.datatype === 'http://www.w3.org/2001/XMLSchema#dateTime') { mapping.date = fieldName }
      if (fieldData.datatype && fieldData.datatype === 'http://www.opengis.net/ont/geosparql#wktLiteral') { mapping.wkt = fieldName }
    }

    return mapping;
  }

  /**
   * We expect four types of data and we will use it this way.
   * - Date, http://www.w3.org/2001/XMLSchema#dateTime
   * - String
   * - WKT, http://www.opengis.net/ont/geosparql#wktLiteral
   * - uri
   *
   * @param response
   * @param mapping
   */
  private validateResponse (response: SparqlResponse, mapping: any) {
    if (!response.results || !response.results.bindings) throw 'The WikiData response does not contain data like expected';
    const firstResult = response.results.bindings[0];
    if (Object.keys(firstResult).length !== 4) throw 'More or less fields were returned from the Sparql query';

    if (mapping.date === null) throw 'Missing date field';
    if (mapping.wkt === null) throw 'Missing wkt field';
    if (mapping.uri === null) throw 'Missing uri field';
    if (mapping.string === null) throw 'Missing string field';
  }

  /**
   * Makes a geojson response from the sparql response.
   *
   * @param response
   * @param mapping
   */
  private responseToGeoJson (response: SparqlResponse, mapping: any) {
    let markers = response.results.bindings.map(item => {
      let latLng = item[mapping.wkt].value
        .replace('Point(', '')
        .replace(')', '')
        .split(' ');

      return {
        "type": "Feature",
        "properties": {
          "name": item[mapping.string].value,
          "url": item[mapping.uri].value,
          "date": item[mapping.date].value,
        },
        "geometry": {
          "type": "Point",
          "coordinates": [parseFloat(latLng[0]), parseFloat(latLng[1])]
        }
      }
    });

    return {
      "type": "FeatureCollection",
      "features": markers
    }
  }

}