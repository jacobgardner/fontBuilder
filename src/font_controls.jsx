'use strict';
var React = require('react');

module.exports = React.createClass({
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
                                        Browse&hellip; <input type="file" />
                                    </span>
                                </span>
                                <input type="text" className="form-control" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Font Size</label>
                        <div className="col-sm-6">
                            <input type="text" defaultValue={64} className="form-control" placeholder="Font Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Spread</label>
                        <div className="col-sm-6">
                            <input type="text" defaultValue={20} className="form-control" placeholder="Spread" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Font BMP Size</label>
                        <div className="col-sm-6">
                            <input type="text" defaultValue={1024} className="form-control" placeholder="Font BMP Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Distance Field BMP Size</label>
                        <div className="col-sm-6">
                            <input type="text" defaultValue={512} className="form-control" placeholder="Distance Field BMP Size" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" /> Build Distance Field <br />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-10">
                            <button className="btn btn-default">Generate Font!</button>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
});