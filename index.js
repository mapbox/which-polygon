'use strict';

var rbush = require('rbush');

exports.index = index;
exports.query = query;

function query(tree, p) {
    var result = tree.search([p[0], p[1], p[0], p[1]]);
    for (var i = 0; i < result.length; i++) {
        var country = result[i][4];
        if (insidePolygon(country.geometry.coordinates, p)) {
            return country.properties;
        }
    }
}

function index(data) {
    var polygons = [];
    for (var i = 0; i < data.features.length; i++) {
        var feature = data.features[i];
        var coords = feature.geometry.coordinates;

        if (feature.geometry.type === 'Polygon') {
            feature.bbox = ringBBox(coords[0]);
            polygons.push(feature);

        } else if (feature.geometry.type === 'MultiPolygon') {
            for (var j = 0; j < coords.length; j++) {
                polygons.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: coords[j]
                    },
                    properties: feature.properties,
                    bbox: ringBBox(coords[j][0])
                });
            }
        }
    }

    return rbush().load(polygons.map(treeItem));
}

function treeItem(country) {
    var item = country.bbox.slice();
    item.push(country);
    return item;
}

// ray casting algorithm for detecting if point is in polygon
function insidePolygon(rings, p) {
    var inside = false;
    for (var i = 0, len = rings.length; i < len; i++) {
        var ring = rings[i];
        for (var j = 0, len2 = ring.length, k = len2 - 1; j < len2; k = j++) {
            if (rayIntersect(p, ring[j], ring[k])) inside = !inside;
        }
    }
    return inside;
}

function rayIntersect(p, p1, p2) {
    return ((p1[1] > p[1]) !== (p2[1] > p[1])) && (p[0] < (p2[0] - p1[0]) * (p[1] - p1[1]) / (p2[1] - p1[1]) + p1[0]);
}

function ringBBox(ring) {
    var bbox = [Infinity, Infinity, -Infinity, -Infinity];

    for (var i = 0; i < ring.length; i++) {
        bbox[0] = Math.min(bbox[0], ring[i][0]);
        bbox[1] = Math.min(bbox[1], ring[i][1]);
        bbox[2] = Math.max(bbox[2], ring[i][0]);
        bbox[3] = Math.max(bbox[3], ring[i][1]);
    }
    return bbox;
}
