/*jslint browser: true */
'use strict';

var React = require('react');
var FontBuilder = require('./font_builder');

var content = document.getElementById('content');

React.render(<FontBuilder />, content)
