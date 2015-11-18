'use strict';

var test = require('tap').test;
var whichPolygon = require('../');

var data = require('./fixtures/states.json');

var query = whichPolygon(data);

test('queries polygons', function (t) {
	t.equal(query([-100, 45]).name, "South Dakota");
	t.equal(query([-90, 30]).name, "Louisiana");
	t.equal(query([-50, 30]), null);
	t.end();
});

test('returns tree', function (t) {
  t.ok(query.tree);
  t.type(query.tree, 'object');
  t.end();
});