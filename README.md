A simple index for matching points and bboxes against a set of GeoJSON polygons to find what polygon it belongs to.
For example, determining the country of a location given a countries GeoJSON.

[![Build Status](https://travis-ci.org/mapbox/which-polygon.svg?branch=master)](https://travis-ci.org/mapbox/which-polygon)
[![Coverage Status](https://coveralls.io/repos/mapbox/which-polygon/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/which-polygon?branch=master)
[![](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

### Example usage

Using [this 50m world countries dataset](https://s3.amazonaws.com/geojson-please/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson):

```js
var geojson = require('./countries.json');
var query = whichPolygon(geojson);

query([30.5, 50.5]).admin; // 'Ukraine'
```

The input GeoJSON must be a feature collection of polygons or multipolygons.
The query returns the properties of the matched polygon feature.

By default, the query returns properties of the first polygon that has been found (object or null).
To return an array of all found polygon properties, use option `multi` as the second argument:

```js
query([14.3, 51.2], true); // [{props1}, {props2}, {props3}, ...] || null
```

Once the index is built, queries are pretty fast —
17 seconds to query 1 million random locations on a Macbook Pro in this particular case.

You can also query all polygons that intersect a given bbox:

```js
var query = whichPolygon(geojson);
var results = query.bbox([30.5, 50.5, 30.51, 50.51]);
results[0].admin; // 'Ukraine'
```
