# Duck

A 2D animated short built with Remotion, using code-drawn puppets and backgrounds. The shot sequence draws on the director's storyboard. The public preview offers both the silent cut and a voiceover cut with all 17 supplied cues. The letter is blank on screen, and the original screenplay, storyboard images, and audio files are not included in this repository.

The preview page also offers five downloadable MP4s and a ZIP containing all of them. The downloads include the full letter on screen.

[Watch the public preview](https://qmzpalgh.github.io/duck-animated-short/)

## Duck in three dimensions

[Open the 3D film](https://qmzpalgh.github.io/duck-animated-short/3d/)

The same story retold as a silent, interactive 3D film, built with three.js. Every set, prop and character is modelled in code from simple shapes, in the 2D film's palette. It follows the 2D cut's chapters: the road, the letter, putting things in order, the kitchen, the garage, the stairs, the two hospital visits between them, and the last scene at the hospital.

- Nothing is spoken. Chapter cards stand in for dialogue, and the letter's handwriting is illegible by design, as in the public preview.
- The story pauses seven times and waits for the viewer: to open the letter, set the last clock, tap the duck, and tap the cup. "Let it play by itself" removes the waiting.
- Drag to turn each set. The timeline jumps between chapters; Space pauses and the arrow keys change chapter.
- The music-box score is optional and off by default. It is played live in the browser from the same progression as `scripts/make_score.py`, and changes to the major key for the last chapter.

The source is in `duck-film/src/world/` and the page is `duck-film/3d/index.html`. `npm run preview:build` builds it alongside the 2D preview, so the Pages workflow publishes both. For local work, `npx vite` serves it at `/3d/`; adding `?s=4&t=6` to the address opens chapter 4 paused at six seconds.

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
