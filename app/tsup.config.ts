import { defineConfig } from 'tsup';

export default defineConfig({
   entry: ['src/index.ts'],
   outDir: 'dist',
   target: 'node22',
   format: ['cjs'],
   dts: true,
   sourcemap: true,
   clean: true,
});
