/*jslint browser: true */
/*global FileReader */
'use strict';
var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            fileName: '',
            fileData: null,
            fontSize: 64,
            spread: 20,
            inSize: 1024,
            outSize: 512,
            distField: true,
        };
    },
    updateFontSize: function (evt) {
        this.setState({
            fontSize: Number(evt.target.value),
        });
    },
    updateSpread: function (evt) {
        this.setState({
            spread: Number(evt.target.value),
        });
    },
    updateInSize: function (evt) {
        this.setState({
            inSize: Number(evt.target.value),
        });
    },
    updateOutSize: function (evt) {
        this.setState({
            outSize: Number(evt.target.value),
        });
    },
    updateDistField: function (evt) {
        this.setState({
            distField: evt.target.checked,
        });
    },
    updateFile: function () {
        var files = this.refs.file_input.getDOMNode().files,
            reader = new FileReader(),
            self = this;

        reader.onload = function () {
            self.setState({
                fileName: files[0].name,
                fileData: this.result,
            });
        };

        reader.readAsArrayBuffer(files[0]);

    },
    generate: function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.props.generateFont(
            this.state.fileData,
            this.state.fontSize,
            this.state.spread,
            this.state.inSize,
            this.state.outSize,
            this.state.distField
        );

    },
    render: function () {
        return (
            <div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-4 control-label">Font File</label>
                        <div className="col-sm-6">
                            <div className="input-group">
                                <span className="input-group-btn">
                                    <span className="btn btn-default btn-file">
                                        Browse&hellip; <input ref="file_input" type="file" onChange={this.updateFile} />
                                    </span>
                                </span>
                                <input type="text" value={this.state.fileName} className="form-control" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Font Size</label>
                        <div className="col-sm-6">
                            <input type="text" value={this.state.fontSize} onChange={this.updateFontSize} className="form-control" placeholder="Font Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Spread</label>
                        <div className="col-sm-6">
                            <input type="text" value={this.state.spread} onChange={this.updateSpread} className="form-control" placeholder="Spread" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Font BMP Size</label>
                        <div className="col-sm-6">
                            <input type="text" value={this.state.inSize} onChange={this.updateInSize} className="form-control" placeholder="Font BMP Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Distance Field BMP Size</label>
                        <div className="col-sm-6">
                            <input type="text" value={this.state.outSize} onChange={this.updateOutSize} className="form-control" placeholder="Distance Field BMP Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={this.state.distField} onChange={this.updateDistField} /> Build Distance Field <br />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-10">
                            <button className="btn btn-default" onClick={this.generate}>Generate Font!</button>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
});