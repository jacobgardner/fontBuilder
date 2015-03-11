attribute vec3 vPos;
attribute vec2 vTex;

varying vec2 texCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
    texCoord = vTex;
}