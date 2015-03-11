/*jslint browser: true */
'use strict';
var opentype = require('opentype.js');

function generateFontMap(ctx, fontData, fontSize, spread, imgSize, offset, callback) {
    var path = null,
        glyph = null,
        img = null,
        font = opentype.parse(fontData),
        scale = fontSize / font.unitsPerEm,
        i = offset,
        x = 0,
        y = 0,
        boundary = null,
        boundaries = [],
        yMax = 0;

    ctx.canvas.width = imgSize;
    ctx.canvas.height = imgSize;
    ctx.imageSmoothingEnabled = false;


    while (i < font.glyphs.length) {
        glyph = font.glyphs[i];

        if (x + 2 * spread + (glyph.xMax - glyph.xMin) * scale > ctx.canvas.width) {
            x = 0;
            y += yMax + 2 * spread;
            yMax = 0;
        }

        if (y + 2 * spread + (glyph.yMax - glyph.yMin) * scale > ctx.canvas.height) {
            x = 0;
            y = 0;
            yMax = 0;
            break;
        }

        boundary = {
            left: x / imgSize,
            right: (x + (glyph.xMax - glyph.xMin) * scale + 2 * spread) / imgSize,
            top: y / imgSize,
            bottom: (y + (glyph.yMax  - glyph.yMin) * scale + spread * 2) / imgSize,
            xOffset: (glyph.xMin * scale) / imgSize,
            yOffset: (glyph.yMin * scale) / imgSize,
            advanceWidth: (glyph.advanceWidth * scale) / imgSize,
        };

        boundaries.push(boundary);

        path = glyph.getPath(spread + x - glyph.xMin * scale, spread + y + glyph.yMax * scale, fontSize);
        x += (glyph.xMax - glyph.xMin) * scale + 2 * spread;

        if ((glyph.yMax - glyph.yMin) * scale > yMax) {
            yMax = (glyph.yMax - glyph.yMin) * scale;
        }

        path.draw(ctx);

        i += 1;
    }

    img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    callback(img, boundaries, i);
}

module.exports.generateFontMap = generateFontMap;