// Noisy particles read as error (magenta). Resolved ones read as signal (cyan).
// Attention peaks pick up amber, the output colour.

uniform vec3 uCyan;
uniform vec3 uMagenta;
uniform vec3 uAmber;

varying float vNoise;
varying float vAttn;
varying float vAlpha;
varying float vShade;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;

  float core = smoothstep(0.5, 0.0, r);
  vec3 col = mix(uMagenta * 0.7, uCyan, 1.0 - vNoise);
  col = mix(col, uAmber, clamp(vAttn * 0.9, 0.0, 1.0));

  // Dark parts of the scan stay dim once resolved, so features show.
  float shade = mix(1.0, 0.25 + 0.75 * vShade, 1.0 - vNoise);
  float alpha = core * vAlpha * shade * (0.3 + 0.7 * (1.0 - vNoise));
  gl_FragColor = vec4(col * (core + vAttn * 0.8), alpha);
}
