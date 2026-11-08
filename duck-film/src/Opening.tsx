import React from 'react';
import {C, Car, Duck, Person} from './Art';
import {ColinClose, DuckClose, Rain} from './StoryArt';
import {Stage, ease, useSeconds} from './Stage';

export const Opening: React.FC = () => {
  const t = useSeconds();
  const duckX = 255 + 80 * ease(t, 0.6, 3.0);
  return <Stage>
    <rect width="1280" height="720" fill={C.darkTeal}/>
    <circle cx="640" cy="370" r="260" fill="#6c9690" opacity=".25"/>
    <path d="M0 560 Q250 510 460 555 T900 543 T1280 555 V720 H0Z" fill="#476d68"/>
    <path d="M130 595 Q360 574 570 592 M710 592 Q850 576 1030 593" fill="none" stroke={C.cream} opacity=".25" strokeWidth="3"/>
    <g opacity={ease(t, 0.2, 1.5)}>
      <text x="640" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" letterSpacing="7" fill={C.cream}>A SHORT ANIMATED FILM</text>
      <text x="660" y="386" textAnchor="middle" fontFamily="Georgia, serif" fontSize="178" fontWeight="bold" letterSpacing="14" fill={C.cream}>DUCK</text>
      <path d="M465 414 H854" stroke={C.ochre} strokeWidth="4"/>
      <text x="660" y="458" textAnchor="middle" fontFamily="Georgia, serif" fontSize="23" letterSpacing="2" fill={C.cream}>Based on the screenplay by Damian Gason</text>
    </g>
    <Duck x={duckX} y={568} scale={1.1} tilt={Math.sin(t * 7) * 2}/>
  </Stage>;
};

const Fox: React.FC = () => <g transform="translate(705 594)" stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
  <path d="M-91 7 Q-157 -4 -156 -48 Q-118 -10 -80 -27 Q-39 -54 9 -41 Q45 -35 73 -10 L108 -3 Q76 19 31 13 L-30 12 Z" fill="#b76f4f"/>
  <path d="M-150 -47 Q-139 -26 -122 -23 L-135 -8 Q-153 -20 -150 -47" fill={C.cream}/>
  <path d="M55 -18 L65 -40 L77 -20 L91 -32 L94 -9" fill="#b76f4f"/>
  <path d="M71 -7 L82 -7" fill="none"/><circle cx="99" cy="-4" r="3" fill={C.ink}/>
</g>;

export const Road: React.FC = () => {
  const t = useSeconds();
  return <Stage>
    <rect width="1280" height="720" fill="#829e9b"/>
    {t < 1.25 ? <>
      <path d="M0 430 Q240 345 500 405 T1000 390 T1280 400 V720 H0Z" fill="#718b82"/>
      <path d="M510 310 L770 310 L1040 720 H235Z" fill="#6a7975"/><path d="M635 354 L626 720" stroke={C.cream} strokeWidth="5" strokeDasharray="35 40" opacity=".7"/>
      <g transform="translate(640 420)" stroke={C.ink} strokeWidth="5" strokeLinejoin="round"><path d="M-115 58 L-105 -40 Q-100 -78 -60 -80 H60 Q100 -78 105 -40 L115 58 Z" fill={C.teal}/><path d="M-79 -38 Q-76 -59 -52 -59 H52 Q76 -59 79 -38 L83 -6 H-83Z" fill="#adc4b7"/><rect x="-87" y="25" width="30" height="13" fill={C.coral}/><rect x="57" y="25" width="30" height="13" fill={C.coral}/><rect x="-27" y="25" width="54" height="17" fill={C.cream}/></g><Rain time={t}/>
      <path d="M0 0 H1280 V54 Q640 30 0 54 Z M0 646 Q620 588 1280 646 V720 H0 Z" fill="#344747"/>
      <g transform={`translate(660 680) rotate(${Math.sin(t*5)*28-18})`}><path d="M0 0 L-275 -535" stroke={C.ink} strokeWidth="18" strokeLinecap="round"/><path d="M-275 -535 L-307 -565" stroke={C.ink} strokeWidth="9"/></g>
    </> : t < 2.35 ? <>
      <rect width="1280" height="720" fill="#a5b8ad"/><path d="M0 525 L480 200 L1280 260 V720 H0 Z" fill="#647a75"/><path d="M-30 120 Q390 30 1280 95" fill="none" stroke="#334b49" strokeWidth="44"/>
      <Rain time={t} opacity={.24}/><path d="M1000 252 Q1140 225 1160 345 L1175 616 H965 Z" fill="#899994" stroke={C.ink} strokeWidth="7"/>
      <ColinClose x={750} y={285} scale={1.55} mood="sad" tilt={-4}/>
      <circle cx="275" cy="530" r="165" fill="none" stroke={C.ink} strokeWidth="30"/><circle cx="275" cy="530" r="15" fill={C.ink}/>
      <path d="M275 530 L180 405 M275 530 L390 450" stroke={C.ink} strokeWidth="12"/>
      <path d="M623 525 Q520 560 393 464 M575 595 Q430 625 254 495" fill="none" stroke="#e0ddcd" strokeWidth="64" strokeLinecap="round"/>
      <circle cx="390" cy="462" r="23" fill="#e8b99a" stroke={C.ink} strokeWidth="4"/><circle cx="255" cy="496" r="23" fill="#e8b99a" stroke={C.ink} strokeWidth="4"/>
    </> : t < 3.45 ? <>
      <rect width="1280" height="720" fill="#777e74"/><path d="M0 568 L1280 495 V720 H0Z" fill="#5c6963"/>
      <g transform="translate(360 210)" stroke={C.ink} strokeWidth="5" strokeLinejoin="round"><path d="M0 180 L175 110 L580 165 L415 245 Z" fill="#d7bd8f"/><path d="M0 180 L0 408 L415 485 L415 245 Z" fill="#bf9b6f"/><path d="M415 245 L580 165 L580 390 L415 485 Z" fill="#ab895f"/>
        <rect x="112" y="24" width="95" height="143" rx="3" fill={C.teal}/><path d="M280 150 Q250 75 300 52 M300 148 Q320 47 355 32 M294 142 Q340 69 390 70" fill="none" stroke="#55765e" strokeWidth="8"/><path d="M243 120 H342 L330 175 H255 Z" fill={C.coral}/><path d="M63 207 h220" stroke="#795c44" strokeWidth="4"/><text x="66" y="273" fontFamily="Georgia, serif" fontSize="28" fill={C.ink} stroke="none">BALLOON WORKS</text><circle cx="350" cy="275" r="20" fill={C.coral}/><path d="M350 295 q10 20 -7 31" fill="none" strokeWidth="2"/>
      </g>
    </> : t < 4.18 ? <>
      <rect width="1280" height="720" fill="#688079"/><g transform="translate(350 48) rotate(3 280 300)"><rect width="580" height="650" fill={C.cream} stroke={C.ink} strokeWidth="6"/><text x="290" y="86" textAnchor="middle" fontFamily="Georgia, serif" fontSize="48" fill={C.ink}>THE DAILY PAPER</text><path d="M30 104 H550 M30 112 H550" stroke={C.ink} strokeWidth="3"/><text x="290" y="177" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="43" fill={C.ink}>FACTORY CLOSES</text><path d="M65 219 H515 V395 H65Z" fill="#b2bca9"/><path d="M65 445 H510 M65 470 H510 M65 495 H510 M65 520 H510 M65 545 H510 M65 570 H510" stroke="#a59783" strokeWidth="7"/></g>
    </> : t < 4.9 ? <>
      <path d="M0 465 H1280 V720 H0Z" fill="#657571"/><path d="M0 440 Q550 350 1280 440 V505 H0Z" fill="#809685"/>
      <g transform={`translate(${940-600*ease(t,4.18,4.9)} 500)`} stroke={C.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M-72 -20 Q-144 -23 -180 -83 Q-190 -38 -144 -4 L-90 16 Q-32 28 26 4 L68 -14 L103 -22 L85 -44 L61 -41 L46 -65 L30 -41 Q-16 -55 -72 -20Z" fill="#b76f4f"/><path d="M-178 -80 Q-177 -54 -159 -39 L-145 -50Z" fill={C.cream}/><path d="M-45 9 L-78 41 M-13 12 L-39 48 M31 0 L75 29 M48 -7 L94 18" fill="none" stroke="#b76f4f" strokeWidth="13"/><circle cx="70" cy="-36" r="3" fill={C.ink}/></g><Rain time={t}/>
      {t>4.55 && <rect width="1280" height="720" fill={C.cream} opacity={1-ease(t,4.55,4.9)}/>}
    </> : t < 6.65 ? <>
      <path d="M0 430 Q500 330 1280 420 V720 H0Z" fill="#819685"/><path d="M0 552 H1280 V720 H0Z" fill="#667572"/>
      <Fox/><Person x={430} y={610} scale={1.02} mood="sad" tilt={-5} arm={18}/><Rain time={t}/>
    </> : t < 9.5 ? <>
      <rect width="1280" height="720" fill="#6b8874"/><DuckClose x={650} y={340} scale={1.7} blink={t>8.8&&t<9}/>
      {Array.from({length:18},(_,i)=><path key={i} d={`M${i*90-80} 720 Q${i*90-40} 360 ${i*90+30} ${470+i%3*30} Q${i*90-10} 590 ${i*90+20} 720Z`} fill={i%2?'#79967b':'#587863'} opacity={i%3===0?.65:.9}/>)}
      <Rain time={t} opacity={.2}/>
    </> : <>
      <path d="M0 410 Q600 300 1280 420 V720 H0Z" fill="#829883"/><path d="M0 540 H1280 V720 H0Z" fill="#6b7b76"/>
      <Car x={330-340*ease(t,9.5,11.9)} y={595} scale={.76} wiper={Math.sin(t*5)*25}/>
      <Duck x={850-100*ease(t,9.7,11.7)} y={596} scale={1.04} face={-1} tilt={Math.sin(t*8)*3}/><Rain time={t}/>
    </>}
  </Stage>;
};
