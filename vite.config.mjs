/** @type {import('vite').UserConfig} */

export default {
  build: {
    lib: {
      name: "VideoCropper",
      entry: ["src/index.ts"],
      formats: ["es", "iife"],
      fileName: (format, entryName) =>
        `video-cropper-${entryName}.${format}.js`,
      cssFileName: "video-cropper"
    }
  }
};
