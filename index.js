'use strict';

var lineclip = require('lineclip');
var Flatbush = require('flatbush');

module.exports = whichPolygon;

function whichPolygon(data, indexData) {
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

    var index;
    if (indexData) {
        index = Flatbush.from(indexData);
    } else {
        index = new Flatbush(bboxes.length);
        for (var k = 0; k < bboxes.length; k++) {
            index.add(bboxes[k].minX, bboxes[k].minY, bboxes[k].maxX, bboxes[k].maxY);
        }
        index.finish();
    }

    function query(p, multi) {
        var output = [],
            result = index.search(
                p[0],
                p[1],
                p[0],
                p[1]
            ).map(function (i) { return bboxes[i]; });
        for (var i = 0; i < result.length; i++) {
            if (insidePolygon(result[i].coords, p)) {
                if (multi)
                    output.push(result[i].props);
                else
                    return result[i].props;
            }
        }
        return multi && output.length ? output : null;
    }

    // CB: this isn't documented as a public api but may be a problem for some?
    // query.tree = tree;
    query.data = index.data;
    query.bbox = function queryBBox(bbox) {
        var output = [];
        var result = index.search(
            bbox[0],
            bbox[1],
            bbox[2],
            bbox[3]
        ).map(function (i) { return bboxes[i]; });
        for (var i = 0; i < result.length; i++) {
            if (polygonIntersectsBBox(result[i].coords, bbox)) {
                output.push(result[i].props);
            }
        }
        return output;
    };

    return query;
}

function polygonIntersectsBBox(polygon, bbox) {
    var bboxCenter = [
        (bbox[0] + bbox[2]) / 2,
        (bbox[1] + bbox[3]) / 2
    ];
    if (insidePolygon(polygon, bboxCenter)) return true;
    for (var i = 0; i < polygon.length; i++) {
        if (lineclip(polygon[i], bbox).length > 0) return true;
    }
    return false;
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
    var item = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
        coords: coords,
        props: props
    };

    for (var i = 0; i < coords[0].length; i++) {
        var p = coords[0][i];
        item.minX = Math.min(item.minX, p[0]);
        item.minY = Math.min(item.minY, p[1]);
        item.maxX = Math.max(item.maxX, p[0]);
        item.maxY = Math.max(item.maxY, p[1]);
    }
    return item;
}
