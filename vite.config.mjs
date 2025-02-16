/** @type {import('vite').UserConfig} */

export default {
  build: {
    lib: {
      entry: ["src/main.js"],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: "my-lib-style"
    }
  }
};
