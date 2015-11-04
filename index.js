'use strict';

var pointInRegion = require('point-in-region');
var rewind = require('geojson-rewind');

module.exports = whichPolygon;

function whichPolygon(data) {
    var vertices = [],
        regions = [],
        propsList = [];

    data = rewind(data, true);

    for (var i = 0; i < data.features.length; i++) {
        var feature = data.features[i];
        var coords = feature.geometry.coordinates;

        if (feature.geometry.type === 'Polygon') {
            addRegion(coords, feature.properties);

        } else if (feature.geometry.type === 'MultiPolygon') {
            for (var j = 0; j < coords.length; j++) {
                addRegion(coords[j], feature.properties);
            }
        }
    }

    var query = pointInRegion(vertices, regions);

    return function (p) {
        return propsList[query(p)] || null;
    };

    function addRegion(poly, props) {
        var region = [];
        for (var k = 0; k < poly.length; k++) {
            var regionRing = [];
            for (var i = 0; i < poly[k].length; i++) {
                regionRing.push(vertices.length);
                vertices.push(poly[k][i]);
            }
            region.push(regionRing);
        }
        regions.push(region);
        propsList.push(props);
    }
}
