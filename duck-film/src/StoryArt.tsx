import React from 'react';
import {C} from './Art';

// Large, simple cut-paper portraits shared by the storyboard's close shots.
export const ColinClose: React.FC<{x:number; y:number; scale?:number; mood?:'sad'|'startled'|'happy'; tilt?:number}> = ({x,y,scale=1,mood='sad',tilt=0}) => <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
  <path d="M-130 204 Q-120 123 -62 102 L-40 86 H42 L62 104 Q120 124 134 204 L148 300 H-148 Z" fill="#e0ddcd"/>
  <path d="M-45 99 L0 141 L45 99 M-8 125 L-16 163 L0 194 L15 163 L8 125" fill={C.darkTeal}/>
  <path d="M-31 71 V103 Q0 122 31 103 V71" fill="#e7b796"/>
  <path d="M-67 -48 Q-69 -112 -8 -119 Q66 -123 70 -50 L65 32 Q59 91 0 98 Q-57 91 -65 30 Z" fill="#e8b99a"/>
  <path d="M-69 -48 Q-77 -89 -57 -106 Q-51 -126 -32 -119 Q-22 -140 -3 -125 Q13 -143 28 -125 Q49 -132 58 -111 Q76 -103 70 -67 L64 -42 Q53 -48 51 -65 Q39 -51 27 -69 Q16 -54 3 -72 Q-10 -55 -22 -71 Q-34 -52 -47 -64 Q-51 -45 -66 -38 Z" fill="#554c46"/>
  <ellipse cx="-27" cy="-10" rx="13" ry={mood==='sad'?7:10} fill={C.white}/><ellipse cx="26" cy="-10" rx="13" ry={mood==='sad'?7:10} fill={C.white}/>
  <circle cx="-24" cy="-9" r="4" fill={C.ink}/><circle cx="29" cy="-9" r="4" fill={C.ink}/>
  <path d={mood==='startled'?'M-43 -33 Q-28 -44 -13 -32 M14 -32 Q28 -44 43 -33':'M-43 -29 Q-30 -33 -13 -27 M14 -27 Q30 -33 43 -29'} fill="none"/>
  <path d="M3 -7 L-4 24 L8 27" fill="none" strokeWidth="3"/>
  <path d={mood==='happy'?'M-18 49 Q0 65 20 48':mood==='startled'?'M-11 48 Q0 36 12 48 Q13 65 0 66 Q-13 65 -11 48':'M-18 57 Q0 47 19 56'} fill={mood==='startled'?C.plum:'none'}/>
</g>;

export const DuckClose: React.FC<{x:number; y:number; scale?:number; blink?:boolean}> = ({x,y,scale=1,blink=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
  <path d="M-45 240 Q-66 167 -57 87 Q-56 48 -79 24 Q-100 -3 -85 -44 Q-68 -88 -22 -92 Q26 -96 52 -60 Q70 -34 67 -3 Q61 28 48 50 Q36 92 52 240 Z" fill={C.white}/>
  <path d="M-78 -31 Q-128 -19 -187 4 Q-198 12 -185 20 Q-128 28 -78 16 Q-65 11 -58 -4 Z" fill={C.orange}/>
  <circle cx="-95" cy="-8" r="3" fill={C.ink}/>
  {blink ? <path d="M-33 -33 Q-22 -26 -12 -33" fill="none"/> : <><ellipse cx="-22" cy="-31" rx="8" ry="10" fill={C.white}/><circle cx="-24" cy="-31" r="4" fill={C.ink}/></>}
  <path d="M-36 -50 Q-23 -57 -11 -50" fill="none" strokeWidth="3"/>
</g>;

export const Rain: React.FC<{time:number; opacity?:number}> = ({time,opacity=.4}) => <g stroke="#e2eee4" strokeWidth="3" opacity={opacity}>{Array.from({length:48},(_,i)=>{
  const x=(i*97+i%4*35)%1400; const y=((i*71+time*240)%810)-80;
  return <path key={i} d={`M${x} ${y} l-16 42`}/>;
})}</g>;
