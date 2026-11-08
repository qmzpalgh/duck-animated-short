import React from 'react';
import {C, Duck, Person, Wall} from './Art';
import {Stage, ease, useSeconds} from './Stage';

export const Search: React.FC = () => {
  const t = useSeconds();
  const duckWalk = Math.sin(t*8)*3;
  return <Stage zoom={1.13}>
    {t < 5.5 ? <>
      <Wall color="#d9c6b0"/>
      <rect x="577" y="335" width="530" height="198" rx="8" fill="#728d84" stroke={C.ink} strokeWidth="5"/>
      <path d="M590 397 H1092 M626 337 V392 M1057 337 V392" fill="none" stroke={C.cream} strokeWidth="5" opacity=".7"/>
      <rect x="550" y="520" width="570" height="48" fill="#8e7060" stroke={C.ink} strokeWidth="5"/>
      <path d="M566 568 V605 M1105 568 V605" stroke={C.ink} strokeWidth="12"/>
      <Person x={385 + 70*ease(t,0,2)} y={625} scale={1.05} mood="startled" arm={58} tilt={32} cast bandage/>
      <path d="M454 450 l100 81" stroke={C.brown} strokeWidth="7"/><path d="M540 526 q20 -26 44 0 q-12 20 -44 0" fill={C.pale} stroke={C.ink} strokeWidth="3"/>
      <Duck x={1048 - 180*ease(t,2,5)} y={599} scale={.55} face={-1} tilt={duckWalk}/>
      <rect x="550" y="520" width="570" height="48" fill="#8e7060" stroke={C.ink} strokeWidth="5"/>
    </> : <>
      <Wall color="#c9c3aa"/>
      <path d="M100 130 H580 V540 H100 Z" fill="#d2d6c6" stroke={C.ink} strokeWidth="5"/><path d="M340 130 V540 M100 330 H580" stroke={C.ink} strokeWidth="4"/>
      <rect x="930" y="366" width="150" height="205" rx="14" fill="#b08d6d" stroke={C.ink} strokeWidth="5"/>
      <path d="M964 373 L951 203 Q959 172 974 194 L1006 370 M1032 373 L1086 221 Q1107 199 1108 229 L1062 374" fill="#647e78" stroke={C.ink} strokeWidth="4"/>
      <Person x={800} y={622} scale={1.08} mood="sad" arm={-100+Math.sin(t*4)*8} bandage cast/>
      <path d="M836 453 L939 389" stroke={C.brown} strokeWidth="7"/><path d="M930 382 q25 -15 36 6 q-8 20 -36 14" fill={C.pale} stroke={C.ink} strokeWidth="3"/>
      <Duck x={245+220*ease(t,6,10.5)} y={603} scale={.62} tilt={duckWalk}/>
    </>}
  </Stage>;
};
