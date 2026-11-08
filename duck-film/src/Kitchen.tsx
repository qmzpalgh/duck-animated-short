import React from 'react';
import {C, Duck, Person, Table, Vase, Wall, Window} from './Art';
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
    <rect width="1280" height="720" fill={C.ink} opacity={black}/>
  </Stage>;
};
