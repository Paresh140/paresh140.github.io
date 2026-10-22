/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: the site is plain files on GitHub Pages (see .github/workflows/pages.yml).
  output: 'export',
  images: { unoptimized: true },
  // Shaders live in their own .glsl files and are imported as raw strings.
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
