'use strict';

var rbush = require('rbush');

module.exports = whichPolygon;

function whichPolygon(data) {
    var bboxes = [];
    for (var i = 0; i < data.features.length; i++) {
        var feature = data.features[i];
        var coords = feature.geometry.coordinates;

        if (feature.geometry.type === 'Polygon') {
            bboxes.push(treeItem(coords, feature.properties));

        } else if (feature.geometry.type === 'MultiPolygon') {
            for (var j = 0; j < coords.length; j++) {
                bboxes.push(treeItem(coords[j], feature.properties));
            }
        }
    }

    var tree = rbush().load(bboxes);

    return function query(p) {
        var result = tree.search([p[0], p[1], p[0], p[1]]);
        for (var i = 0; i < result.length; i++) {
            if (insidePolygon(result[i][4], p)) return result[i][5];
        }
        return null;
    };
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

function treeItem(coords, props) {
    var item = [Infinity, Infinity, -Infinity, -Infinity, coords, props];

    for (var i = 0; i < coords[0].length; i++) {
        var p = coords[0][i];
        item[0] = Math.min(item[0], p[0]);
        item[1] = Math.min(item[1], p[1]);
        item[2] = Math.max(item[2], p[0]);
        item[3] = Math.max(item[3], p[1]);
    }
    return item;
}
