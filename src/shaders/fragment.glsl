varying vec3 vNormal;
varying float vPerlin;

void main() {
  float temp = vPerlin + 0.05;
  temp *= 2.0;
  gl_FragColor = vec4(temp + 0.3, temp, temp, 1.0);
}
