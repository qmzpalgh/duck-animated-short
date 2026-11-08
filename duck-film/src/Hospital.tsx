import React from 'react';
import {C, Duck, Person, Wall, Window} from './Art';
import {Stage, ease, useSeconds} from './Stage';

const Trolley: React.FC<{x:number}> = ({x}) => <g transform={`translate(${x} 450)`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
  <path d="M0 0 L25 150 H190 L210 0 M-12 0 H223 M20 91 H195" fill="none"/>
  <rect x="16" y="-25" width="180" height="32" rx="5" fill="#9aaca4"/>
  <path d="M46 -25 Q44 -54 91 -54 Q135 -54 134 -25Z" fill={C.cream}/>
  <circle cx="39" cy="159" r="10" fill={C.ink}/><circle cx="174" cy="159" r="10" fill={C.ink}/>
</g>;

export const Hospital: React.FC<{visit?: 1 | 2}> = ({visit = 1}) => {
  const t = useSeconds();
  return <Stage zoom={1.1}>
    <Wall color="#d4dfd0" floor="#bbb7a5" stripes={false}/>
    <path d="M0 140 H1280 M0 144 H1280" stroke={C.cream} strokeWidth="4" opacity=".7"/>
    <Window x={112} y={92} w={230} h={260} sky="#b4d1c5"/>
    <rect x="460" y="350" width="360" height="182" rx="14" fill="#e8e8d8" stroke={C.ink} strokeWidth="5"/>
    <path d="M430 519 H859 M451 519 V620 M838 519 V620" stroke={C.ink} strokeWidth="9"/>
    <rect x="467" y="326" width="174" height="55" rx="20" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
    <Person x={617} y={622} scale={1.04} mood="sad" bandage cast={visit===2} arm={visit===2?20:-8}/>
    {visit===1 && <><Person x={410} y={620} scale={.95} kind="doctor" arm={-95}/><path d="M454 385 L545 356" stroke={C.ink} strokeWidth="8"/><circle cx="549" cy="354" r="6" fill={C.ochre}/></>}
    <Trolley x={1010-65*ease(t,0,2)}/>
    <Person x={1062-65*ease(t,0,2)} y={622} scale={1.04} kind="cleaner" mood="sad" tilt={-5} arm={15}/>
    <g opacity={ease(t,2.0,3.0)}><path d="M931 214 q25 -18 43 0 M978 214 q18 -18 42 0" fill="none" stroke={C.ink} strokeWidth="3"/></g>
  </Stage>;
};

const Patient: React.FC<{smile:boolean}> = ({smile}) => <g stroke={C.ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
  <path d="M415 426 Q450 389 526 395 L812 397 Q843 400 850 440 L848 493 Q820 515 770 513 L492 506 Q440 503 414 476 Z" fill={C.cream}/>
  <path d="M470 404 L476 501 M516 398 L522 506 M564 399 L570 507 M613 399 L619 508 M664 400 L670 509 M716 401 L722 510 M768 402 L774 510" stroke="#c3c8b9" strokeWidth="2"/>
  <path d="M382 398 Q345 396 336 432 Q333 466 365 478 Q394 488 415 465 L420 420 Q411 402 382 398" fill="#e8b99a"/>
  <path d="M346 421 Q341 395 367 390 Q390 388 408 401 L412 411 Q385 403 365 417 Z" fill="#514b45"/>
  <path d="M343 411 L407 404 L412 424 L342 431 Z" fill={C.cream}/>
  <path d="M354 412 L356 428 M370 410 L372 426 M386 408 L388 424" stroke="#c1c2ae" strokeWidth="2"/>
  <circle cx="375" cy="438" r="6" fill={C.white}/><circle cx="376" cy="438" r="2" fill={C.ink}/>
  <path d={smile?'M365 458 Q377 468 389 456':'M365 462 Q376 456 388 462'} fill="none"/>
</g>;

const CareCloseup: React.FC<{t:number}> = ({t}) => {
  const offer = ease(t, 7, 9);
  const retreat = ease(t, 11.5, 13.2);
  const cupX = 560 - 190*offer + 190*retreat;
  return <Stage>
    <Wall color="#d6dfd0" floor="#b8b8a8" stripes={false}/>
    <path d="M0 145 H1280" stroke={C.cream} strokeWidth="5" opacity=".65"/>
    <rect x="75" y="408" width="1000" height="186" rx="28" fill="#e4e9df" stroke={C.ink} strokeWidth="5"/>
    <rect x="145" y="370" width="300" height="165" rx="45" fill={C.white} stroke={C.ink} strokeWidth="5"/>
    <path d="M435 430 Q490 390 558 400 L995 407 L995 581 L548 568 Q484 564 436 534 Z" fill={C.cream} stroke={C.ink} strokeWidth="5"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${520+i*75} 405 l12 154`} stroke="#c3c8b9" strokeWidth="3"/>)}
    <g transform="translate(315 462)" stroke={C.ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-87 -20 Q-84 -84 -18 -91 Q49 -91 69 -30 L75 26 Q59 73 0 77 Q-67 71 -84 23 Z" fill="#e8b99a"/>
      <path d="M-83 -43 Q-77 -97 -20 -101 Q32 -99 59 -69 L60 -53 Q3 -67 -53 -45 Z" fill="#514b45"/>
      <path d="M-84 -59 L60 -73 L68 -34 L-83 -20 Z" fill={C.cream}/>
      <path d="M-48 -61 L-44 -28 M-15 -64 L-11 -31 M18 -67 L22 -35" stroke="#c3c8b9" strokeWidth="3"/>
      <ellipse cx="13" cy="-4" rx="12" ry="8" fill={C.white}/><circle cx="18" cy="-4" r="3" fill={C.ink}/>
      <path d="M-4 39 Q14 33 29 39" fill="none"/>
    </g>
    <Person x={650} y={715} scale={1.55} kind="cleaner" mood="neutral" arm={8} hideLeftArm/>
    {/* The reaching arm and cup are a single animated gesture. */}
    <path d={`M590 430 Q550 470 ${cupX+31} 500`} fill="none" stroke={C.ink} strokeWidth="36" strokeLinecap="round"/>
    <path d={`M590 430 Q550 470 ${cupX+31} 500`} fill="none" stroke="#659a90" strokeWidth="28" strokeLinecap="round"/>
    <circle cx={cupX+26} cy="500" r="16" fill="#a86c54" stroke={C.ink} strokeWidth="4"/>
    <g transform={`translate(${cupX} 517) rotate(${offer*17})`} stroke={C.ink} strokeWidth="4"><path d="M-23 -50 H23 L17 0 H-17 Z" fill={C.white}/><path d="M-18 -28 H18 L15 -4 H-14 Z" fill={C.ochre} stroke="none"/></g>
    <path d="M60 580 H1085 M101 580 V680 M1045 580 V680" stroke={C.ink} strokeWidth="10"/>
  </Stage>;
};

export const LastHospital: React.FC = () => {
  const t = useSeconds();
  if (t >= 6.2 && t < 13.5) return <CareCloseup t={t}/>;
  const arrival = ease(t, 2.5, 5);
  const cleaning = ease(t, 13.8, 15.5);
  const heart = ease(t, 16.4, 17.2);
  const departure = ease(t, 20, 23);
  return <Stage zoom={1.08}>
    <Wall color="#d6dfd0" floor="#b8b8a8" stripes={false}/>
    <path d="M0 145 H1280" stroke={C.cream} strokeWidth="5" opacity=".65"/>
    <Window x={105} y={76} w={260} h={280} sky="#a8c9c0"/>
    <g transform="translate(115 85)"><path d="M10 245 Q80 203 132 235 T240 226 V258 H10Z" fill="#83a99a"/><Duck x={145-300*departure} y={245-210*departure} scale={.46} face={-1} flap={departure>0?Math.sin(t*16)*24:0}/></g>
    <rect x="285" y="366" width="610" height="159" rx="20" fill="#e2e7d9" stroke={C.ink} strokeWidth="5"/>
    <rect x="310" y="376" width="150" height="98" rx="25" fill={C.white} stroke={C.ink} strokeWidth="4"/>
    <Patient smile={t>16}/>
    <path d="M278 505 H904 M304 505 V629 M876 505 V629" stroke={C.ink} strokeWidth="10"/>
    <rect x="865" y="470" width="167" height="132" fill="#a98268" stroke={C.ink} strokeWidth="5"/>
    <rect x="877" y="487" width="143" height="41" fill="#d1b399" stroke={C.ink} strokeWidth="3"/><circle cx="949" cy="506" r="4" fill={C.ink}/>
    <g transform="translate(945 465)" stroke={C.ink} strokeWidth="3"><path d="M-18 -38 H18 L13 0 H-13 Z" fill={C.cream}/><path d="M-14 -23 H14 L12 -4 H-11 Z" fill={C.ochre} stroke="none"/></g>
    <path d="M1007 540 q8 18 0 31" stroke={C.ochre} strokeWidth="6" opacity={t>11?1:0}/>
    <Person x={1160-185*arrival} y={626} scale={1.12} kind="cleaner" mood={t>16?'happy':'neutral'} arm={t>13?68:35} tilt={t>13?-5:0}/>
    {t>13 && <path d={`M${1005-23*cleaning} ${556+Math.sin(t*7)*5} l26 -4 l9 18 l-30 3Z`} fill={C.cream} stroke={C.ink} strokeWidth="3"/>}
    <g opacity={heart} transform="translate(510 325)"><path d="M0 0 Q-22 -28 -42 0 Q-41 18 0 45 Q41 18 42 0 Q22 -28 0 0" fill={C.coral} stroke={C.ink} strokeWidth="3"/></g>
  </Stage>;
};

export const EndCard: React.FC = () => {
  const t = useSeconds();
  const flight = ease(t, .2, 4.8);
  return <Stage>
    <rect width="1280" height="720" fill={C.darkTeal}/>
    <circle cx="640" cy="350" r="225" fill="#799c8b" opacity=".18"/>
    <text x="640" y="334" textAnchor="middle" fontFamily="Georgia, serif" fontSize="78" letterSpacing="8" fill={C.cream}>THE END</text>
    <path d="M475 365 H805" stroke={C.ochre} strokeWidth="3"/>
    <text x="640" y="414" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" letterSpacing="3" fill={C.cream}>A LITTLE KINDNESS GOES A LONG WAY</text>
    <Duck x={150+flight*1000} y={585-flight*270-Math.sin(flight*Math.PI)*80} scale={.75} flap={Math.sin(t*17)*28} tilt={-8}/>
  </Stage>;
};
