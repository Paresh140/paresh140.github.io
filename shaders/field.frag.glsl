uniform vec3 uColor;
uniform float uOpacity;

varying float vTwinkle;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r) * vTwinkle * uOpacity;
  gl_FragColor = vec4(uColor, a);
}
