import React from 'react';
import {C, Clock, Duck, Person, Wall, Window} from './Art';
import {Stage, useSeconds} from './Stage';

export const Cleaning: React.FC = () => {
  const t = useSeconds();
  const beat = Math.sin(t * 6);
  return <Stage zoom={1.15}>
    {t < 2 ? <>
      <rect width="1280" height="720" fill="#b58e78"/>
      {Array.from({length:8},(_,i)=><g key={i} stroke="#977666" strokeWidth="3"><path d={`M0 ${i*85} H1280`}/>{Array.from({length:7},(_,j)=><path key={j} d={`M${j*200+(i%2)*100} ${i*85} v85`}/>)}</g>)}
      <rect y="600" width="1280" height="120" fill="#b8ac94"/>
      <g transform="translate(240 465)" fill={C.cream} stroke={C.ink} strokeWidth="4">{[0,1,2,3,4].map(i=><rect key={i} x={i*3} y={i*14} width="380" height="47" rx="3"/>)}<text x="45" y="33" fontFamily="Georgia, serif" fontSize="27" fill={C.ink} stroke="none">THE DAILY PAPER</text></g>
      <Duck x={820} y={616} scale={1.35} face={-1} tilt={Math.sin(t*5)*3}/>
    </> : t < 4 ? <>
      <rect width="1280" height="720" fill="#b2a187"/><g transform="translate(245 54) rotate(-2 395 300)"><rect width="790" height="615" fill={C.cream} stroke={C.ink} strokeWidth="5"/><text x="70" y="110" fontFamily="Georgia, serif" fontStyle="italic" fontSize="58" fill={C.ink}>Things to do</text><path d="M65 139 H720" stroke="#bcae99" strokeWidth="3"/>
      {['Tidy the house','Wash everything','Set the clocks','One last thing'].map((line,i)=><g key={line}><rect x="74" y={188+i*89} width="32" height="32" fill="none" stroke={C.ink} strokeWidth="3"/>{i<3&&<path d={`M80 ${204+i*89} l8 9 l19 -23`} fill="none" stroke={C.teal} strokeWidth="5"/>}<text x="135" y={215+i*89} fontFamily="Georgia, serif" fontSize="37" fill={C.ink}>{line}</text></g>)}</g>
    </> : t < 7 ? <>
      <Wall color="#d4c7ac"/>
      <Window x={950} y={80} w={210} h={250}/>
      <path d="M600 570 H940 L910 438 Q887 407 848 407 H690 Q648 407 630 438 Z" fill="#bb8371" stroke={C.ink} strokeWidth="5"/>
      <path d="M690 442 H887 M655 484 H913" stroke={C.ink} strokeWidth="3" opacity=".4"/>
      <Person x={442} y={625} scale={1.12} mood="sad" tilt={7} arm={30+beat*8}/>
      <g transform={`translate(${510+beat*20} 555)`} stroke={C.ink} strokeWidth="5" strokeLinecap="round"><path d="M0 0 L-42 -120"/><path d="M-8 0 H105 Q118 0 118 11 V20 H-18 V11Z" fill={C.darkTeal}/><path d="M-42 -120 Q-114 -155 -124 -87 Q-134 -17 -64 -8" fill="none"/></g>
      <g fill={C.cream} opacity=".85"><circle cx="735" cy="544" r="4"/><circle cx="756" cy="531" r="3"/><circle cx="782" cy="550" r="3"/></g>
    </> : t < 10 ? <>
      <Wall color="#d0d3bb"/>
      <Window x={513} y={70} w={255} h={260}/>
      <rect x="45" y="427" width="1190" height="165" fill="#e0d2b7" stroke={C.ink} strokeWidth="5"/>
      <path d="M45 468 H1235 M290 468 V592 M555 468 V592 M820 468 V592 M1075 468 V592" fill="none" stroke={C.ink} strokeWidth="3"/>
      <path d="M575 427 Q600 478 702 427 M640 426 V391 Q640 376 659 376 Q676 376 676 390" fill="none" stroke={C.ink} strokeWidth="7"/>
      <Person x={655} y={618} scale={1.07} mood="sad" arm={40+beat*12}/>
      {[0,1,2,3,4].map(i => <g key={i} transform={`translate(${190+i*53} ${420-i*2})`}><ellipse rx="20" ry="39" fill={C.cream} stroke={C.ink} strokeWidth="4"/><ellipse rx="12" ry="28" fill="none" stroke="#bdc6b6" strokeWidth="2"/></g>)}
      {[0,1,2].map(i => <circle key={i} cx={740+i*25} cy={401-(i%2)*20+beat*4} r={8+i*2} fill={C.cream} opacity=".8"/>)}
    </> : <>
      <Wall color="#c9c4b0"/>
      <path d="M70 475 H1210" stroke={C.brown} strokeWidth="18"/>
      <Clock x={215} y={353} r={63} hand={-.5}/><Clock x={450} y={353} r={63} hand={-.5}/><Clock x={685} y={353} r={63} hand={-.5}/><Clock x={920} y={353} r={63} hand={t < 11.2 ? .7 : -.5}/>
      <Person x={1020} y={629} scale={1.08} mood="sad" arm={-120+beat*3}/>
      <text x="180" y="165" fontSize="23" fontFamily="Georgia, serif" letterSpacing="4" fill={C.ink} opacity=".7">A PLACE FOR EVERYTHING</text>
    </>}
  </Stage>;
};
