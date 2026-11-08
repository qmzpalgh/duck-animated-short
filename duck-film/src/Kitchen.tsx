import React from 'react';
import {C, Duck, Person, Table, Vase, Wall, Window} from './Art';
import {ColinClose} from './StoryArt';
import {Stage, ease, useSeconds} from './Stage';

export const Kitchen: React.FC = () => {
  const t = useSeconds();
  const duckFlight = ease(t, 3.6, 6.2);
  const duckExit = ease(t, 6.2, 8.3);
  const fall = ease(t, 6.2, 7.4);
  const black = ease(t, 10.4, 11.9);
  return <Stage zoom={1.1}>
    <Wall color="#c7d2bb" floor="#b9a489"/>
    <Window x={900} y={82} w={265} h={268}/>
    <rect x="52" y="376" width="390" height="200" fill="#d9d3be" stroke={C.ink} strokeWidth="5"/>
    <path d="M53 420 H440 M195 420 V576 M325 420 V576" fill="none" stroke={C.ink} strokeWidth="4"/>
    <rect x="475" y="357" width="230" height="220" rx="5" fill="#8c9b94" stroke={C.ink} strokeWidth="5"/>
    <rect x="495" y="406" width="190" height="143" fill="#3d4b48" stroke={C.ink} strokeWidth="5"/>
    <path d="M510 430 H670 M510 448 H670" stroke="#83928b" strokeWidth="4"/>
    {[0,1,2,3].map(i=><circle key={i} cx={510+i*52} cy="380" r="7" fill={C.cream} stroke={C.ink} strokeWidth="3"/>)}
    <Table x={730} y={505} w={390}/>
    <Vase x={918 + fall * 45} y={492 + fall * 80} tilt={fall*82}/>
    <Person x={690 - ease(t,0,3)*40 + fall*120} y={620 + fall*20} scale={1.08} mood={t>4.5?'startled':'sad'} arm={t>4.5?80:35} tilt={fall*35}/>
    {t > 3.6 && <Duck x={1230-duckFlight*310-duckExit*300} y={230+duckFlight*215+duckExit*60} scale={.9} flap={Math.sin(t*18)*26} tilt={-16+duckFlight*16} face={-1}/>}
    {t > 7 && <ellipse cx="930" cy="583" rx={105*ease(t,7,8)} ry="14" fill="#a8c4bb" opacity=".8"/>}
    {t > 8.6 && <g transform="translate(825 441)" fill={C.cream} stroke={C.ink} strokeWidth="4"><path d="M0 -45 L10 -13 L40 -28 L20 -2 L48 7 L19 15 L33 40 L7 24 L-3 53 L-12 22 L-38 37 L-23 9 L-48 2 L-20 -7 L-31 -34 L-8 -18 Z"/></g>}
    {t<3.3 && <g>
      <rect width="1280" height="720" fill="#c7d2bb"/><path d="M0 566 H1280 V720 H0Z" fill="#b9a489"/>
      <rect x="490" y="190" width="320" height="385" rx="7" fill="#8c9b94" stroke={C.ink} strokeWidth="6"/><rect x="520" y="274" width="260" height="240" fill="#3d4b48" stroke={C.ink} strokeWidth="5"/><path d="M540 307 H760 M540 337 H760 M540 367 H760" stroke="#9aaca3" strokeWidth="5"/>
      {[0,1,2,3].map(i=><circle key={i} cx={540+i*70} cy="231" r="9" fill={C.cream} stroke={C.ink} strokeWidth="3"/>)}
      <g transform={`translate(${365+35*ease(t,.2,2)} 505)`} stroke={C.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-48 38 Q-80 70 -75 111 L-112 128 Q-118 145 -94 147 L-34 132 L8 88 L48 111 L15 137 Q8 151 33 153 L91 128 L74 73 L31 34Z" fill="#3b4e52"/>
        <path d="M-38 -69 Q-70 -55 -63 2 L-48 47 Q0 72 51 44 L63 -17 Q55 -61 22 -69Z" fill="#d9d5c5"/><path d="M-5 -54 L-12 -18 L0 -4 L10 -18 L5 -54" fill={C.darkTeal}/>
        <path d="M32 -35 Q78 -18 120 12" fill="none" stroke="#d9d5c5" strokeWidth="32"/><circle cx="120" cy="12" r="16" fill="#e8b99a"/>
        <path d="M-38 -86 Q-40 -128 0 -132 Q42 -128 42 -86 L35 -55 Q0 -36 -34 -55Z" fill="#e8b99a"/><path d="M-39 -96 Q-45 -132 -23 -139 Q-12 -150 0 -139 Q14 -149 26 -137 Q46 -129 42 -96 Q31 -105 24 -113 Q15 -100 3 -113 Q-8 -100 -20 -112 Q-28 -99 -39 -96Z" fill="#554c46"/><circle cx="-14" cy="-83" r="3" fill={C.ink}/><circle cx="14" cy="-83" r="3" fill={C.ink}/><path d="M-8 -62 Q0 -67 9 -62" fill="none"/>
      </g>
    </g>}
    {t>=8.6 && t<10.4 && <g><rect width="1280" height="720" fill="#bbc6b6"/><path d="M0 500 H1280 M0 580 H1280 M0 660 H1280 M150 460 V720 M350 460 V720 M550 460 V720 M750 460 V720 M950 460 V720 M1150 460 V720" stroke="#a0af9e" strokeWidth="4"/><ColinClose x={620} y={390} scale={2.2} mood="startled" tilt={-28}/><g fill={C.ochre}><path d="M840 205 l15 -48 l15 48 Z M900 260 l45 -15 l-35 35 Z"/></g></g>}
    <rect width="1280" height="720" fill={C.ink} opacity={black}/>
  </Stage>;
};
