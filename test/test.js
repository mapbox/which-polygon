'use strict';

var test = require('tap').test;
var whichPolygon = require('../');

var data = require('./fixtures/states.json');

var query = whichPolygon(data);

test('queries polygons with a point', function (t) {
	t.equal(query([-100, 45]).name, "South Dakota");
	t.equal(query([-90, 30]).name, "Louisiana");
	t.equal(query([-50, 30]), null);
	t.end();
});


test('queries polygons with a bbox', function (t) {
  t.equal(query.bbox([-100, 45, -99.5, 45.5])[0].name, "South Dakota");

  var qq = query.bbox([-104.2, 44, -103, 45]);
  var names = qq.map(function (el) { return el.name; }).sort();
  t.equal(qq.length, 2);
  t.like(names, ["South Dakota", "Wyoming"]);
  t.end();
});
