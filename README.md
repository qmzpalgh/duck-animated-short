# Duck

A 2D animated short built with Remotion, using code-drawn puppets and backgrounds. The shot sequence draws on the director's storyboard. The public preview offers both the silent cut and a voiceover cut with all 17 supplied cues. The letter is blank on screen, and the original screenplay, storyboard images, and audio files are not included in this repository.

The preview page also offers five downloadable MP4s and a ZIP containing all of them. The downloads include the full letter on screen.

[Watch the public preview](https://qmzpalgh.github.io/duck-animated-short/)

## Preview and edit

With Node.js 20.19+, 22.13+ or 24+:

```sh
cd duck-film
npm ci
npm run dev
```

In Remotion Studio, `Public-Preview` works without any private files. The full `Duck-Silent` and `Duck-Lily` compositions use local production materials in `duck-film/public/private-cues/`. Put all 17 WAV files from the supplied cue archive there and add `letter.json`, an array of seven strings containing the letter lines. Then run `python scripts/prepare_cues.py` from `duck-film` to create normalized local copies. Those files, the source screenplay and rendered videos are ignored by Git.

```sh
npx remotion render Duck-Silent out/duck-silent.mp4
npx remotion render Duck-Lily out/duck-lily.mp4
```

The Lily cut uses all 17 local cues; the silent cut has no spoken dialogue. Both have the original, synthesized score. Its generator is `duck-film/scripts/make_score.py` and requires Python, NumPy and FFmpeg only when regenerating the score.

`npm run preview:build` produces the public player. Its Vite configuration copies only the generated score, never the private asset directory. The GitHub Pages workflow uses separately supplied Actions secrets to render the downloadable films and reconstruct the publicly playable mixed soundtrack; the original recordings and letter file remain outside the repository. For a local voiced preview, place the mixed soundtrack at `dist/voiceover.m4a` after the build.
