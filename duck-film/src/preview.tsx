import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {Film, FPS, TOTAL_SECONDS} from './Film';
import './preview.css';

const base = new URL('.', window.location.href).pathname;

const Preview: React.FC = () => {
  const [voiceover, setVoiceover] = useState(true);
  return <>
  <main>
    <header><span className="mark">D.</span><span>AN ANIMATED SHORT</span><span className="runtime">2 MIN 24 SEC</span></header>
    <div className="intro"><p className="eyebrow">A SMALL STORY ABOUT LOOKING OUT FOR SOMEONE</p><h1>Duck<span>.</span></h1><p>A quiet, darkly comic tale told with paper-cut puppets and a very determined duck.</p></div>
    <div className="versions" role="group" aria-label="Choose a version">
      <button type="button" aria-pressed={voiceover} onClick={() => setVoiceover(true)}>Voiceover + cues</button>
      <button type="button" aria-pressed={!voiceover} onClick={() => setVoiceover(false)}>Silent film</button>
    </div>
    <div className="screen"><Player key={voiceover ? 'voiced' : 'silent'} component={Film} inputProps={{includePrivate:false, voiceover, assetBase:base}} durationInFrames={TOTAL_SECONDS*FPS} fps={FPS} compositionWidth={1280} compositionHeight={720} controls style={{width:'100%', aspectRatio:'16 / 9'}}/></div>
    <div className="caption"><span>THE PUBLIC PREVIEW</span><p>The preview keeps the letter blank on screen. The downloadable films include the full letter; the original source files stay out of the repository.</p></div>
    <a className="three-d" href={`${base}3d/`}><span><b>New: Duck in three dimensions</b>The same story as a silent, interactive 3D film. Turn the sets around, and help the duck along.</span><span className="go">Open the 3D film →</span></a>
    <section className="downloads" aria-labelledby="downloads-heading">
      <div className="downloads-heading">
        <div><p className="eyebrow">FOR THE DIRECTOR</p><h2 id="downloads-heading">Download the films</h2><p>Five MP4 versions, ready to share.</p></div>
        <a className="download-all" href={`${base}downloads/duck-all-versions.zip`} download>Download all five <span>ZIP ↓</span></a>
      </div>
      <div className="download-groups">
        <div className="download-group"><h3>Storyboard cut</h3><p>The latest rework, based on the director's drawings.</p>
          <a href={`${base}downloads/04-storyboard-silent.mp4`} download>Silent film <span>MP4 ↓</span></a>
          <a href={`${base}downloads/05-storyboard-all-cues.mp4`} download>Voiceover + all cues <span>MP4 ↓</span></a>
        </div>
        <div className="download-group"><h3>Earlier cut</h3><p>The original animation, before the storyboard rework.</p>
          <a href={`${base}downloads/01-original-silent.mp4`} download>Silent film <span>MP4 ↓</span></a>
          <a href={`${base}downloads/02-original-lily-voiceover.mp4`} download>Lily voiceover <span>MP4 ↓</span></a>
          <a href={`${base}downloads/03-original-all-cues.mp4`} download>Voiceover + all cues <span>MP4 ↓</span></a>
        </div>
      </div>
    </section>
    <footer><span>Based on the screenplay by Damian Gason</span><span>Made with Remotion</span></footer>
  </main>
  </>;
};

createRoot(document.getElementById('root')!).render(<React.StrictMode><Preview/></React.StrictMode>);
