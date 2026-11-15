// Noisy particles read as error (magenta). Resolved ones read as signal (cyan),
// shaded by the scan's brightness. Attention peaks pick up amber, the output colour.

uniform vec3 uCyan;
uniform vec3 uMagenta;
uniform vec3 uAmber;

varying float vNoise;
varying float vAttn;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;

  float resolved = 1.0 - vNoise;
  vec3 col = mix(uMagenta * 0.7, uCyan, resolved);

  // Once resolved, the scan's colour only sets brightness: the head stays in the
  // signal-cyan palette, with hair and glasses darker so the features read.
  if (vColor.x >= 0.0) {
    float lum = dot(vColor, vec3(0.299, 0.587, 0.114));
    col *= mix(1.0, 0.55 + 1.3 * lum, resolved);
  }
  col = mix(col, uAmber, clamp(vAttn * 0.3, 0.0, 1.0));

  // Soft glowing dots, as before; the depth test still keeps the back of the head
  // from showing through the face.
  float core = smoothstep(0.5, 0.0, r);
  float alpha = min(1.0, core * 1.4) * vAlpha * (0.3 + 0.7 * resolved);
  if (alpha < 0.04) discard;
  gl_FragColor = vec4(col * (core * 1.5 + vAttn * 0.6), alpha);
}
