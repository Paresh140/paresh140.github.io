// Ambient latent dust. Drifts slowly so the void never reads as empty.

uniform float uTime;
uniform float uPixelRatio;

attribute float aSeed;

varying float vTwinkle;

void main() {
  vec3 p = position;
  p.x += sin(uTime * 0.15 + aSeed * 30.0) * 0.4;
  p.y += cos(uTime * 0.12 + aSeed * 17.0) * 0.4;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.0 + fract(aSeed * 7.3) * 1.2) * uPixelRatio * (7.0 / -mv.z);
  vTwinkle = 0.4 + 0.6 * sin(uTime * 0.8 + aSeed * 50.0) * 0.5 + 0.5;
}
