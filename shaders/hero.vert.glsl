// Diffusion denoising. Each particle walks from Gaussian noise (uT = 0)
// to its slot in the word (uT = 1). Particles resolve on staggered timings
// (aSeed) so the word forms unevenly, the way a sampler converges.

uniform float uT;
uniform float uTime;
uniform vec3 uMouse;      // attention query, in world space
uniform float uDissolve;  // 0 = name visible, 1 = name has streamed forward
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aTarget;
attribute vec3 aStart;
attribute float aSeed;

varying float vNoise;
varying float vAttn;
varying float vAlpha;

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

void main() {
  float noiseAmt = pow(1.0 - uT, 1.6);

  // Staggered denoising: each particle has its own window within [0, 1].
  float local = clamp((uT - aSeed * 0.35) / 0.65, 0.0, 1.0);
  vec3 pos = mix(aTarget, aStart, pow(1.0 - local, 2.0));

  // Residual noise jitter, which decays as the image resolves.
  vec3 wobble = vec3(
    sin(uTime * 1.3 + aSeed * 40.0),
    cos(uTime * 1.1 + aSeed * 23.0),
    sin(uTime * 0.9 + aSeed * 17.0)
  );
  pos += wobble * noiseAmt * 0.18;

  // Attention: particles near the query lean toward it.
  vec3 toQuery = uMouse - pos;
  float d = length(toQuery);
  float attn = exp(-d * d * 0.35);
  pos += toQuery * attn * 0.25;

  // Dissolve: stream forward toward the camera and fan out.
  float dir = hash(aSeed * 91.7) - 0.5;
  pos.z += uDissolve * (3.0 + aSeed * 10.0);
  pos.x += dir * uDissolve * 5.0;
  pos.y += (aSeed - 0.5) * uDissolve * 3.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (1.0 + attn * 1.6) / -mv.z;

  vNoise = noiseAmt;
  vAttn = attn;
  vAlpha = 1.0 - uDissolve;
}
