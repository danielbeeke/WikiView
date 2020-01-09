export const battlesQuery = `SELECT DISTINCT ?sitelink (SAMPLE(?itemLabel) AS ?title) (SAMPLE(?point_in_time) AS ?date) (SAMPLE(?geo) AS ?lat_lng) WHERE {
      ?item ((wdt:P31*)/(wdt:P279*)) wd:Q178561;
        wdt:P625 ?geo;
        wdt:P585 ?point_in_time.
        ?item rdfs:label ?itemLabel. 
      filter(lang(?itemLabel) = 'en')
      ?sitelink schema:about ?item;
        schema:inLanguage "en";
        schema:isPartOf <https://en.wikipedia.org/>.
    }
    GROUP BY ?sitelink
`;
