// The loss surface. This must match `lossHeight` in lib/surface.ts exactly,
// so the ball rolls on the same function the shader draws.

#define N 9

uniform float uStrength[N];
uniform vec2 uCenter[N];

varying float vHeight;
varying vec2 vXZ;
varying float vValley;

float lossHeight(vec2 p) {
  float h = 1.2 + 0.35 * sin(p.x * 0.55) * cos(p.y * 0.55);
  for (int i = 0; i < N; i++) {
    vec2 d = p - uCenter[i];
    h -= uStrength[i] * 2.2 * exp(-dot(d, d) / (2.0 * 1.8 * 1.8));
  }
  return h;
}

void main() {
  vec3 p = position;
  float h = lossHeight(p.xz);
  p.y = h;

  vHeight = h;
  vXZ = p.xz;
  vValley = clamp(-h / 2.4, 0.0, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
