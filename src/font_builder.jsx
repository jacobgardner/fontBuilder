'use strict';
var React = require('react');
var FontCanvas = require('./font_canvas');
var GLExample = require('./gl_example');
var FontControls = require('./font_controls');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-6">
                    <FontCanvas
                        fontPath="/fonts/Roboto-Regular.ttf"
                        fontSize={64} spread={20} inSize={1024}
                        outSize={512} distanceField={true} />

                    <FontControls />
                </div>
                <div className="col-md-6">
                    <GLExample />
                </div>
            </div>
        );
    },
});
