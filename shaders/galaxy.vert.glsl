// The Embedding Galaxy. Each cluster is a Gaussian blob. Hover expands a
// cluster outward, and focus dims the rest. Satellites (aSat = 1) are the
// smaller related-skill points.

#define CLUSTERS 4

uniform vec3 uCenters[CLUSTERS];
uniform vec3 uColors[CLUSTERS];
uniform float uExpand[CLUSTERS];
uniform float uDim[CLUSTERS];
uniform float uTime;
uniform float uPixelRatio;

attribute float aCluster;
attribute vec3 aOffset;
attribute float aSeed;
attribute float aSat;

varying vec3 vColor;
varying float vAlpha;

void main() {
  int idx = int(aCluster + 0.5);
  vec3 center = uCenters[idx];
  float ex = uExpand[idx];

  vec3 p = center + aOffset * (1.0 + ex * 0.6);
  p += vec3(sin(uTime * 0.6 + aSeed * 6.0), cos(uTime * 0.5 + aSeed * 4.0), 0.0) * 0.05 * (1.0 + aSat);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float base = mix(3.2, 1.8, aSat);
  gl_PointSize = base * uPixelRatio * (1.0 + ex * 0.6) * (16.0 / -mv.z);
  gl_Position = projectionMatrix * mv;

  vColor = uColors[idx];
  vAlpha = mix(0.4, 0.75, aSat) * uDim[idx];
}
