/*jslint browser: true */
'use strict';
var opentype = require('opentype.js');

function generateFontMap(ctx, fontPath, fontSize, spread, imgSize, offset, callback) {
    ctx.canvas.width = imgSize;
    ctx.canvas.height = imgSize;
    ctx.imageSmoothingEnabled = false;

    opentype.load(fontPath, function (err, font) {
        console.log('Font');
        if (err) {
            console.log(err);
        } else {
            var path = null,
                glyph = null,
                img = null,
                scale = fontSize / font.unitsPerEm,
                i = offset,
                x = 0,
                y = 0,
                boundary = null,
                boundaries = [],
                yMax = 0;


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
                    left: x,
                    right: x + (glyph.xMax - glyph.xMin) * scale + 2 * spread,
                    top: y,
                    bottom: y + (glyph.yMax  - glyph.yMin) * scale + spread * 2,
                    xOffset: glyph.xMin * scale,
                    yOffset: glyph.yMin * scale,
                    advanceWidth: glyph.advanceWidth * scale,
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
    });
}

module.exports.generateFontMap = generateFontMap;