precision mediump float;
uniform sampler2D fontTexture;
uniform sampler2D dfieldTexture;
uniform bool use_dfield;
varying vec2 texCoord;

void main(void) {
    vec4 color;
    float mask;
    float alpha;
    // vec2 normalized = texCoord - 0.5;
    // vec2 norm = normalize(normalized);
    // float radius = 0.46;
    // float border = 0.04;
    // float d = abs(radius - distance(normalized, vec2(0, 0)));
    // float t = 0.0;

    // vec2 coord = texCoord * 1.1 - 0.05;
    // color = texture2D(shipTexture, vec2(1.0 - coord.s, 1.0 - coord.t)) +
    //          texture2D(shieldTexture, vec2(1.0 - coord.s, 1.0 - coord.t));

    // if (coord.x < 0.0 || coord.x > 1.0 || coord.y < 0.0 || coord.y > 1.0 ) {
    //     color = vec4(0.0, 0.0, 0.0, 0.0);
    // }

    // // Health is between [-1, 1]
    // if (dot(norm, vec2(0, -1)) < health) {

    //     if (d < border) {
    //         t = d / border / 0.5;
    //     } else {
    //         t = 1.0;
    //     }
    // } else {
    //     t = 1.0;
    // }


    if (use_dfield) {
        mask = texture2D(dfieldTexture, texCoord).a;

        if (mask < 0.5) {
            alpha = 0.0;
        } else {
            alpha = 1.0;
        }

        alpha = smoothstep(0.48, 0.52, mask);

        color = vec4(1.0, 1.0, 1.0, alpha);

        gl_FragColor = color;
    } else {
        gl_FragColor = texture2D(fontTexture, texCoord);
    }

    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
