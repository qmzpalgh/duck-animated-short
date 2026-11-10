import {copyFileSync} from 'node:fs';
import {defineConfig} from 'vite';

// Do not copy public/: it also contains the user's private production files.
export default defineConfig({
  base: './',
  publicDir: false,
  // Two pages: the 2D film's preview at the root and the 3D version under /3d/.
  build: {rollupOptions: {input: {main: 'index.html', world: '3d/index.html'}}},
  plugins: [{name:'copy-generated-score-only', closeBundle() { copyFileSync('public/score.mp3', 'dist/score.mp3'); }}],
});
