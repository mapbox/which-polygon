'use strict';

var whichPolygon = require('./');

console.time('load counties');
var data = require('./countries.json');
console.timeEnd('load counties');

console.time('preprocess');
var query = whichPolygon(data);
console.timeEnd('preprocess');

if (query([30.5, 50.5]).admin !== 'Ukraine')
    throw new Error('Not Ukraine');

var len = 10000;

var points = [];
for (var i = 0; i < len; i++) {
    points.push([
        Math.random() * 360 - 180,
        Math.random() * 180 - 90]);
}

console.time('query ' + len + ' points');
for (i = 0; i < points.length; i++) {
    query(points[i]);
}
console.timeEnd('query ' + len + ' points');
