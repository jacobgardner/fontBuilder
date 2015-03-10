/*jslint browser: true, nomen: true, todo: true, continue: true */
/*global self*/
'use strict';

var distance_field = require('./distance_field');

self.onmessage = function (e) {
    var data = e.data,
        dField = null;

    dField = distance_field.generateSignedDistanceField(data.image, data.outSize, data.spread);

    self.postMessage({imageData: dField});
};