/*jslint browser: true */
/*global ImageData */
'use strict';
var build_spiral = require('./spiral').build_spiral;
var DEBUG = true;

function getImage(img, x, y) {
    var offset = (y * img.width + x) * 4;

    if (DEBUG) {
        if (y !== Math.floor(y) || x !== Math.floor(x)) {
            throw ('setImage not sending integers');
        }
    }

    if (img.data[offset + 3] < 1) {
        return false;
    }

    return true;

}


function findSignedDistance(img, centerX, centerY, spread, spiral) {
    var startX = Math.max(0, centerX - spread),
        endX = Math.min(img.width - 1, centerX + spread),
        startY = Math.max(0, centerY - spread),
        endY = Math.min(img.height - 1, centerY + spread),
        closest = spread,
        base = getImage(img, Math.floor(centerX), Math.floor(centerY)),
        i = 0,
        x = 0,
        y = 0;

    for (i = 0; i < spiral.length; i += 1) {
        x = Math.floor(spiral[i][0] + centerX);
        y = Math.floor(spiral[i][1] + centerY);
        if (!(x < startX || x > endX || y < startY || y > endY)) {
            if (getImage(img, x, y) !== base) {
                closest = spiral[i][2];
                break;
            }
        }
    }

    if (base === true) {
        return Math.min(closest, spread);
    }

    return Math.min(closest, spread) * -1;
}


function setImage(img, x, y, distance, spread) {
    var offset = (y * img.width + x) * 4,
        alpha = 0.5 + 0.5 * (distance / spread);

    if (DEBUG) {
        if (y !== Math.floor(y) || x !== Math.floor(x)) {
            throw ('setImage not sending integers');
        }
    }

    alpha = Math.min(1, Math.max(0, alpha));

    img.data[offset]     = 255;
    img.data[offset + 1] = 255;
    img.data[offset + 2] = 255;
    img.data[offset + 3] = alpha * 255;


}


function generateSignedDistanceField(img, outSize, spread) {
    var downscale = img.width / outSize,
        outImage = new ImageData(outSize, outSize),
        outSpread = Math.ceil(spread / downscale),
        x = 0,
        y = 0,
        distance = 0,
        adjustedX = 0,
        adjustedY = 0,
        spiral = build_spiral(outSpread);

    for (y = 0; y < outSize; y += 1) {
        for (x = 0; x < outSize; x += 1) {
            adjustedX = (x * downscale) + downscale / 2;
            adjustedY = (y * downscale) + downscale / 2;

            distance = findSignedDistance(img, adjustedX, adjustedY, spread, spiral);
            setImage(outImage, x, y, distance, outSpread);
        }
    }

    return outImage;
}

module.exports.generateSignedDistanceField = generateSignedDistanceField;