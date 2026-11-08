import {copyFileSync} from 'node:fs';
import {defineConfig} from 'vite';

// Do not copy public/: it also contains the user's private production files.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [{name:'copy-generated-score-only', closeBundle() { copyFileSync('public/score.mp3', 'dist/score.mp3'); }}],
});
