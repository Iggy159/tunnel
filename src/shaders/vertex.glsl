varying vec3 vNormal;
varying float vPerlin;
varying vec3 vPosition;
uniform float uTime;
varying vec2 vUv;

void main() {
  //vUv = UV;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}