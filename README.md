A simple index for matching points against a set of GeoJSON polygons to find what polygon a point belongs to.
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

Once the index is built, queries are pretty fast —
17 seconds to query 1 million random locations on a Macbook Pro in this particular case.
