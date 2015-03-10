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
            this.props.fontPath,
            this.props.fontSize,
            this.props.spread,
            this.props.inSize,
            0,
            function (image, boundaries, offset) {
                var dField = null;
                font_img.src = canvas.toDataURL();

                if (self.props.distanceField) {
                    dField = new DistFieldWorker();
                    dField.postMessage({
                        image: image,
                        outSize: self.props.outSize,
                        spread: self.props.spread - 1,
                    });

                    dField.onmessage = function (e) {
                        canvas.width = self.props.outSize;
                        canvas.height = self.props.outSize;
                        ctx.putImageData(e.data.imageData, 0, 0);

                        dfield_img.src = canvas.toDataURL();

                    };

                    // dField = distance_field.generateSignedDistanceField(image, self.props.outSize, self.props.spread - 1);
                    // canvas.width = self.props.outSize;
                    // canvas.height = self.props.outSize;
                    // ctx.putImageData(dField, 0, 0);

                }
            }
        );

    },
    componentDidMount: function () {
        this.drawFont();
    },
    componentDidUpdate: function () {
        this.drawFont();
    },
    render: function () {
        return (
            <div>
                <div className="font-canvas">
                    <canvas ref="font_canvas"></canvas>
                </div>
                <img ref="font_img" width={250} />
                <img ref="dfield_img" width={250} />
            </div>
        );
    }
});