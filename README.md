A simple index for matching points against a set of GeoJSON polygons to find what polygon a point belongs to.

For example, given a GeoJSON of world countries, it can be used to determine what country a location belongs to.


### Example usage

Using [this 50m world countries dataset](https://s3.amazonaws.com/geojson-please/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson):

```js
var geojson = require('./countries.json');
var tree = whichPolygon.index(geojson);

whichPolygon.query(tree, [30.5, 50.5]).admin; // 'Ukraine'
```

The input GeoJSON must be a feature collection of polygons or multipolygons.

Once the index is built, queries are pretty fast —
20 seconds to query 1 million random locations on a Macbook Pro in this particular case.
