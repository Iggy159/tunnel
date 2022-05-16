#pragma glslify: cnoise3 = require('glsl-noise/simplex/3d')
#pragma glslify: cnoise4 = require('glsl-noise/simplex/4d')

varying vec3 vNormal;
varying float vPerlin;
varying vec3 vPosition;
uniform float uTime;
varying vec2 vUv;

float fbn(vec4 p) {
  float sun = 0.0;
  float amp = 1.0;
  float scale = 1.0;

  for(int i = 0; i < 6; i++) {
    sun += cnoise4(p * scale) * amp;
    p.w += 100.;
    amp *= 0.9;
    scale *= 2.0;
  }
  return sun;
}

void main() {
  vec4 p = vec4(vPosition * 3.0, uTime * 0.05);
  float noise = fbn(p);
  vec4 p1 = vec4(vPosition * 2.0, uTime * 0.05);
  float spots = max(cnoise4(p1), 0.0);
  gl_FragColor = vec4(noise, noise, noise, 1.0);
  gl_FragColor *= mix(1.0, spots, 0.8);

  //gl_FragColor *= min(1.0, spots, 0.7);
}
