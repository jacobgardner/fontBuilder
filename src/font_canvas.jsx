/*jslint browser: true, todo: true */
'use strict';

var React = require('react');
var font_map = require('./font_map');

var DistFieldWorker = require('worker!./dfield_worker');

var PIXEL_RATIO = window.devicePixelRatio || 1;
var DEBUG = true;

module.exports = React.createClass({
    drawFont: function () {
        var canvas = this.refs.font_canvas.getDOMNode(),
            font_img = this.refs.font_img.getDOMNode(),
            dfield_img = this.refs.dfield_img.getDOMNode(),
            ctx = canvas.getContext('2d'),
            self = this;

        canvas.width = this.props.inSize;
        canvas.height = this.props.inSize;

        // TODO: Move a lot of this processing to worker.
        font_map.generateFontMap(
            ctx,
            this.props.fontData,
            this.props.fontSize,
            this.props.spread,
            this.props.inSize,
            0,
            function (image, boundaries, offset) {
                var dField = null,
                    vertices = [],
                    boundary = null,
                    i = 0,
                    v0 = [],
                    v1 = [],
                    v2 = [],
                    v3 = [];

                for (i = 0; i < boundaries.length; i += 1) {
                    boundary = boundaries[i];
                    v0[0] = boundary.xOffset + boundary.right - boundary.left;
                    v0[1] = boundary.yOffset + boundary.top - boundary.bottom;

                    v1[0] = boundary.xOffset;
                    v1[1] = v0[1];

                    v2[0] = v0[0];
                    v2[1] = boundary.yOffset;

                    v3[0] = v1[0];
                    v3[1] = v2[1];

                    vertices.push(v0[0], v0[1], 0, boundary.right, boundary.top);
                    vertices.push(v1[0], v1[1], 0, boundary.left, boundary.top);
                    vertices.push(v2[0], v2[1], 0, boundary.right, boundary.bottom);

                    vertices.push(v1[0], v1[1], 0, boundary.left, boundary.top);
                    vertices.push(v3[0], v3[1], 0, boundary.left, boundary.bottom);
                    vertices.push(v2[0], v2[1], 0, boundary.right, boundary.bottom);

                }

                font_img.src = canvas.toDataURL();

                if (self.props.distanceField) {
                    dField = new DistFieldWorker();
                    dField.postMessage({
                        image: image,
                        outSize: self.props.outSize,
                        spread: self.props.spread,
                    });

                    dField.onmessage = function (e) {
                        canvas.width = self.props.outSize;
                        canvas.height = self.props.outSize;
                        ctx.putImageData(e.data.imageData, 0, 0);

                        dfield_img.src = canvas.toDataURL();

                        self.props.updateExample(font_img, dfield_img, vertices);
                    };

                } else {
                    self.props.updateExample(font_img, dfield_img, vertices);
                }
            }
        );

    },
    componentDidMount: function () {
        this.drawFont();
    },
    componentDidUpdate: function (prevProps) {
        if (!(this.props.fontData === prevProps.fontData &&
                this.props.fontSize === prevProps.fontSize &&
                this.props.spread === prevProps.spread &&
                this.props.inSize === prevProps.inSize &&
                this.props.outSize === prevProps.outSize &&
                this.props.distanceField === prevProps.distanceField)) {
            this.drawFont();
        }
    },
    render: function () {
        return (
            <div>
                <div className="font-canvas">
                    <canvas ref="font_canvas"></canvas>
                </div>
                <img ref="font_img" width="50%" />
                <img ref="dfield_img" width="50%" />
            </div>
        );
    }
});