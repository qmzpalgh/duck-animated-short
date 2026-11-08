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
    <div className="caption"><span>THE PUBLIC PREVIEW</span><p>The voiced cut includes Lily's letter and all the supplied cues. The letter remains blank on screen, and the original files stay out of the repository.</p></div>
    <footer><span>Based on the screenplay by Damian Gason</span><span>Made with Remotion</span></footer>
  </main>
  </>;
};

createRoot(document.getElementById('root')!).render(<React.StrictMode><Preview/></React.StrictMode>);
