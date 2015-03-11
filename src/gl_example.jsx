/*jslint browser: true, bitwise: true, todo: true */
/*global Float32Array */
'use strict';
var React = require('react');
var mat4 = require('gl-matrix').mat4;

function Texture(gl, img) {
    var tex = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return tex;
}

function Shader(gl, type, data, path) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, data);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw ('An error occured compiling `' + path + '` : ' + gl.getShaderInfoLog(shader));
    }

    return shader;
}

function GLExample(canvas) {
    var self = this,
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
        fontUniform = null,
        dfieldUniform = null,
        pUniform = null,
        mvUniform = null,
        useDFieldUniform = null,
        fontTex = null,
        dfieldTex = null,
        text_buffer = null,
        vPosAttr = null,
        vTexAttr = null,
        mvMatrix = new Float32Array(16),
        pMatrix = new Float32Array(16),
        vertShader = new Shader(gl, gl.VERTEX_SHADER, require('raw!./shader.vert'), 'vertShader'),
        fragShader = new Shader(gl, gl.FRAGMENT_SHADER, require('raw!./shader.frag'), 'fragShader'),
        step = Float32Array.BYTES_PER_ELEMENT,
        stride = step * 5,
        program;

    program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    fontUniform = gl.getUniformLocation(program, 'fontTexture');
    dfieldUniform = gl.getUniformLocation(program, 'dfieldTexture');
    useDFieldUniform = gl.getUniformLocation(program, 'use_dfield');
    pUniform = gl.getUniformLocation(program, 'uPMatrix');
    mvUniform = gl.getUniformLocation(program, 'uMVMatrix');

    vPosAttr = gl.getAttribLocation(program, 'vPos');
    vTexAttr = gl.getAttribLocation(program, 'vTex');

    gl.enableVertexAttribArray(vPosAttr);
    gl.enableVertexAttribArray(vTexAttr);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    self.render = function () {
        var aspect, width, height;
        window.requestAnimationFrame(self.render);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);

        if (!text_buffer) {
            return;
        }

        width = height = 1;
        aspect = canvas.width / canvas.height;

        if (aspect >= 1.0) {
            width *= aspect;
        } else {
            height *= aspect;
        }

        mat4.ortho(pMatrix, -1 * width, width, -1 * height, height, -100, 100);
        mat4.fromScaling(mvMatrix, [5, 5, 5]);

        gl.uniformMatrix4fv(pUniform, false, pMatrix);
        gl.uniformMatrix4fv(mvUniform, false, mvMatrix);

        gl.uniform1i(fontUniform, 0);
        gl.uniform1i(dfieldUniform, 1);
        gl.uniform1i(useDFieldUniform, true);

        if (dfieldTex) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, dfieldTex);
        }

        if (fontTex) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, fontTex);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, text_buffer);
        gl.drawArrays(gl.TRIANGLES, 6*8, 6);

    };

    self.updateExample = function (font_img, dfield_img, vertices) {
        if (vertices === null) {
            return;
        }

        if (fontTex !== null) {
            gl.deleteTexture(fontTex);
            fontTex = null;
        }

        if (dfieldTex !== null) {
            gl.deleteTexture(dfieldTex);
            dfieldTex = null;
        }

        fontTex = new Texture(gl, font_img);

        if (dfield_img !== null) {
            dfieldTex = new Texture(gl, dfield_img);
        }

        for (var i = 0; i < 6; i += 1) {
            console.log(vertices.slice(i * 5, i * 5 + 5));
        }

        text_buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, text_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.vertexAttribPointer(vPosAttr, 3, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(vTexAttr, 2, gl.FLOAT, false, stride, step * 3);

    };

    window.requestAnimationFrame(self.render);

}

module.exports = React.createClass({
    updateExample: function () {
        // console.log('update');

        this.example.updateExample(this.props.fontImg, this.props.dfieldImg, this.props.vertices);
    },
    shouldComponentUpdate: function (nextProps) {
        if (this.props.fontImg === nextProps.fontImg && this.props.dfieldImg === nextProps.dfieldImg && this.props.vertices === nextProps.vertices) {
            return false;
        }

        return true;
    },
    componentDidMount: function () {
        this.example = new GLExample(this.refs.gl.getDOMNode());
        this.updateExample();
    },
    componentDidUpdate: function () {
        this.updateExample();
    },
    render: function () {
        return (
            <div className="col-sm-12">
                <canvas height="500" width="500" ref="gl"></canvas>
            </div>
        );
    }
});