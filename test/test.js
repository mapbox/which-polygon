'use strict';

var test = require('tap').test;
var whichPolygon = require('../');

var data = require('./fixtures/states.json');

var query = whichPolygon(data);

test('queries polygons with a point', function (t) {
    t.equal(query([-100, 45]).properties.name, "South Dakota");
    t.equal(query([-90, 30]).properties.name, "Louisiana");
    t.equal(query([-50, 30]), null);
    t.end();
});

test('queries polygons with a bbox', function (t) {
    t.equal(query.bbox([-100, 45, -99.5, 45.5])[0].properties.name, "South Dakota");

    var qq = query.bbox([-104.2, 44, -103, 45]);
    var names = qq.map(function (el) { return el.properties.name; }).sort();
    t.equal(qq.length, 2);
    t.like(names, ["South Dakota", "Wyoming"]);
    t.end();
});

test('queries overlapping polygons with a point', function (t) {
    var dataOverlapping = require('./fixtures/overlapping.json');
    var queryOverlapping = whichPolygon(dataOverlapping);

    t.equal(queryOverlapping([7.5, 7.5]).properties.name, "A", "without multi option");
    var result = queryOverlapping([7.5, 7.5], true);
    t.same([result[0].properties, result[1].properties], [{"name": "A"}, {"name": "B"}], "with multi option");
    t.equal(queryOverlapping([-10, -10]), null);
    t.end();
});
