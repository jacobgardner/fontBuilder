'use strict';
var React = require('react');
var FontCanvas = require('./font_canvas');
var GLExample = require('./gl_example');
var FontControls = require('./font_controls');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            fontData: null,
            fontSize: null,
            spread: null,
            inSize: null,
            outSize: null,
            distField: false,
            fontImg: null,
            dfieldImg: null,
            vertices: null,
        };
    },
    updateExample: function (font_img, dfield_img, vertices) {
        this.setState({
            fontImg: font_img,
            dfieldImg: dfield_img,
            vertices: vertices,
        });
    },
    generateFont: function (data, fontSize, spread, inSize, outSize, distField) {
        this.setState({
            fontData: data,
            fontSize: fontSize,
            spread: spread,
            inSize: inSize,
            outSize: outSize,
            distField: distField,
        });
    },
    render: function () {
        var fontCanvas = null;

        if (this.state.fontData) {
            fontCanvas = (
                <FontCanvas fontData={this.state.fontData}
                    fontSize={this.state.fontSize}
                    spread={this.state.spread}
                    inSize={this.state.inSize}
                    outSize={this.state.outSize}
                    distanceField={this.state.distField}
                    updateExample={this.updateExample} />
            );

        }

        return (
            <div className="row">
                <div className="col-md-6">
                    {fontCanvas}

                    <FontControls generateFont={this.generateFont} />
                </div>
                <div className="col-md-6">
                    <GLExample
                        fontImg={this.state.fontImg}
                        dfieldImg={this.state.dfieldImg}
                        vertices={this.state.vertices} />
                </div>
            </div>
        );
    },
});
