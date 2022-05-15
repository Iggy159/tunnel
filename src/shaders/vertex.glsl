// #pragma glslify: cnoise3 = require('glsl-noise/simplex/3d')
// #pragma glslify: cnoise4 = require('glsl-noise/simplex/4d')

// uniform float uTime;
// varying vec3 vNormal;
// varying float vPerlin;
// varying vec3 vPosition;
// varying vec2 vUv;

// void main() {

//   float uDist = .6;
//   float uDistStrength = 1.0;
//   float uDispl = 2.0;
//   float uDisplStrength = 0.1;

//   vec3 newPosition = position;

//   vec3 displacementPosition = position * uDispl;

//   displacementPosition += cnoise4(vec4(displacementPosition * uDist, uTime * 0.07)) * uDistStrength;
//   //displacementPosition.y += cnoise3(vec3(position.xz * uDist, uTime * 0.05)) * uDistStrength;
//   //displacementPosition.z += cnoise3(vec3(position.xy * uDist, uTime * 0.05)) * uDistStrength;

//   float perlinStrength = cnoise4(vec4(displacementPosition, uTime * 0.001)) * uDisplStrength;

//   newPosition += normal * perlinStrength;

//   vec4 viewPosition = viewMatrix * vec4(newPosition, 1.0);

//   gl_Position = projectionMatrix * viewPosition;

//   vNormal = normal;
//   vPerlin = perlinStrength;

// }


uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  //vUv = UV;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}