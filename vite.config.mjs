/** @type {import('vite').UserConfig} */

export default {
  build: {
    lib: {
      entry: ["src/index.ts"],
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `video-cropper-${entryName}.${format}.js`,
      cssFileName: "video-cropper"
    }
  }
};
