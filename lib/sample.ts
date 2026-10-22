// Helpers for the hero particles: Gaussian noise and text rasterisation.

// Box-Muller transform: one standard-normal sample.
export function gaussian(): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Rasterise `text` on an offscreen canvas and return `count` target points
// sampled from its opaque pixels. Returned as a flat xyz Float32Array in
// world units, centred on the origin, `width` wide.
export function sampleText(text: string, count: number, width: number, font: string): Float32Array {
  const W = 1200;
  const H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Float32Array(count * 3);

  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, W / 2, H / 2);

  const data = ctx.getImageData(0, 0, W, H).data;
  const pixels: number[] = [];
  for (let i = 3; i < data.length; i += 4 * 2) {
    if (data[i] > 128) pixels.push((i - 3) / 4);
  }

  const out = new Float32Array(count * 3);
  const scale = width / W;
  for (let i = 0; i < count; i++) {
    const idx = pixels.length ? pixels[Math.floor(Math.random() * pixels.length)] : 0;
    const px = idx % W;
    const py = Math.floor(idx / W);
    out[i * 3] = (px - W / 2) * scale + (Math.random() - 0.5) * scale * 0.6;
    out[i * 3 + 1] = -(py - H / 2) * scale + (Math.random() - 0.5) * scale * 0.6;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return out;
}
