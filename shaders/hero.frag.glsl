// Noisy particles read as error (magenta). Resolved ones take the scan's colour,
// tinted toward signal cyan. Attention peaks pick up amber, the output colour.

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

  // Once resolved, scan points take their real colour with a cyan cast, so the
  // face is recognisable but still belongs to the latent-space palette.
  if (vColor.x >= 0.0) {
    float lum = dot(vColor, vec3(0.299, 0.587, 0.114));
    vec3 scan = mix(vColor, uCyan * (0.25 + lum), 0.22) * 1.45;
    col = mix(col, scan, resolved * resolved);
  }
  col = mix(col, uAmber, clamp(vAttn * 0.3, 0.0, 1.0));

  // Hard-edged discs (depth-tested), with a soft rim and fade while noisy or dissolving.
  float alpha = smoothstep(0.5, 0.38, r) * vAlpha * (0.35 + 0.65 * resolved);
  if (alpha < 0.05) discard;
  gl_FragColor = vec4(col, alpha);
}
