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
        };
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
            console.log(this.state);
            fontCanvas = (
                <FontCanvas fontData={this.state.fontData}
                    fontSize={this.state.fontSize}
                    spread={this.state.spread}
                    inSize={this.state.inSize}
                    outSize={this.state.outSize}
                    distanceField={this.state.distField} />
            );

        }

        return (
            <div className="row">
                <div className="col-md-6">
                    {fontCanvas}

                    <FontControls generateFont={this.generateFont} />
                </div>
                <div className="col-md-6">
                    <GLExample />
                </div>
            </div>
        );
    },
});
