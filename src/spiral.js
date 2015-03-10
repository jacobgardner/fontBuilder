'use strict';

function build_spiral(radius) {
    /*
        Precalculate the spread of pixels and their distances.
        It's a lot cheaper than doing distance from centerX -> offsetX for every pixel.
        Also, we can sort the spiral by distance so if we find a match, we can exit early.
    */
    var spiral = [],
        level = 0,
        op = 1,
        x = 0,
        y = 0;

    while (true) {
        if (op === 2) {
            x += 1;

            if (x === level) {
                op = 3;
            }
        } else if (op === 3) {
            y -= 1;

            if (y === -level) {
                op = 4;
            }
        } else if (op === 4) {
            x -= 1;

            if (x === -level) {
                op = 1;
            }
        } else if (op === 1) {
            y += 1;

            if (y === level + 1) {
                level += 1;

                if (level > radius) {
                    break;
                }

                op = 2;
            }
        }

        spiral.push([x, y, Math.sqrt(x * x + y * y)]);
    }

    return spiral.sort(function (a, b) {
        if (a[2] < b[2]) {
            return -1;
        }

        if (a[2] > b[2]) {
            return 1;
        }

        return 0;
    });
}

module.exports.build_spiral = build_spiral;