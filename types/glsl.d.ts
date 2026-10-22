// Shader files are imported as raw strings (see next.config.mjs).
declare module '*.glsl' {
  const source: string;
  export default source;
}
