varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(vColor * (0.6 + glow), glow * vAlpha);
}
