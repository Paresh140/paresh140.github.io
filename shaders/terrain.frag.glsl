// Deep valleys glow signal-cyan. Ridges fade to void with a magenta rim.
// A faint contour grid makes the gradient readable.

uniform vec3 uCyan;
uniform vec3 uMagenta;
uniform vec3 uVoid;
uniform float uTime;

varying float vHeight;
varying vec2 vXZ;
varying float vValley;

void main() {
  vec3 col = mix(uMagenta * 0.14, uCyan, vValley);
  col = mix(uVoid, col, 0.25 + 0.6 * vValley);

  float contour = abs(fract(vHeight * 2.0) - 0.5);
  float line = smoothstep(0.48, 0.5, contour);
  col += line * 0.08 * uCyan;

  float grid = smoothstep(0.02, 0.0, abs(fract(vXZ.x * 0.5) - 0.5) - 0.48);
  col += grid * 0.03;

  float pulse = 0.5 + 0.5 * sin(uTime * 1.2 - vHeight * 3.0);
  gl_FragColor = vec4(col * (0.85 + 0.15 * pulse), 0.92);
}
