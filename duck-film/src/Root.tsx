import React from 'react';
import {Composition, Folder} from 'remotion';
import {Film, FPS, TOTAL_SECONDS} from './Film';
import {Opening, Road} from './Opening';
import {Letter} from './Letter';
import {Cleaning} from './Cleaning';
import {Kitchen} from './Kitchen';
import {Garage} from './Garage';
import {Hospital, LastHospital, EndCard} from './Hospital';
import {Search} from './Search';
import {Staircase} from './Staircase';

const size = {width:1280, height:720, fps:FPS};
export const RemotionRoot: React.FC = () => <>
  <Composition id="Duck-Silent" component={Film} {...size} durationInFrames={TOTAL_SECONDS*FPS} defaultProps={{includePrivate:true, voiceover:false, assetBase:''}}/>
  <Composition id="Duck-Lily" component={Film} {...size} durationInFrames={TOTAL_SECONDS*FPS} defaultProps={{includePrivate:true, voiceover:true, assetBase:''}}/>
  <Composition id="Public-Preview" component={Film} {...size} durationInFrames={TOTAL_SECONDS*FPS} defaultProps={{includePrivate:false, voiceover:false, assetBase:''}}/>
  <Folder name="Scenes">
    <Composition id="Opening" component={Opening} {...size} durationInFrames={6*FPS}/>
    <Composition id="Road" component={Road} {...size} durationInFrames={12*FPS}/>
    <Composition id="Letter" component={Letter} {...size} durationInFrames={24*FPS} defaultProps={{includePrivate:true}}/>
    <Composition id="Cleaning" component={Cleaning} {...size} durationInFrames={14*FPS}/>
    <Composition id="Kitchen" component={Kitchen} {...size} durationInFrames={12*FPS}/>
    <Composition id="Hospital" component={Hospital} {...size} durationInFrames={7*FPS} defaultProps={{visit:1 as const}}/>
    <Composition id="Garage" component={Garage} {...size} durationInFrames={12*FPS}/>
    <Composition id="Search" component={Search} {...size} durationInFrames={11*FPS}/>
    <Composition id="Staircase" component={Staircase} {...size} durationInFrames={11*FPS}/>
    <Composition id="LastHospital" component={LastHospital} {...size} durationInFrames={24*FPS}/>
    <Composition id="EndCard" component={EndCard} {...size} durationInFrames={5*FPS}/>
  </Folder>
</>;
