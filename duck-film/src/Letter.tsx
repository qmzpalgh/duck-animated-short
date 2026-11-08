import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {C, Person, Table, Vase, Wall, Window} from './Art';
import {ColinClose} from './StoryArt';
import {Stage, ease, useSeconds} from './Stage';

export const Letter: React.FC<{includePrivate?: boolean}> = ({includePrivate = false}) => {
  const t = useSeconds();
  const [lines, setLines] = useState<string[]>([]);
  const [handle] = useState(() => includePrivate ? delayRender('Loading the local letter') : null);
  useEffect(() => {
    if (handle === null) return;
    fetch(staticFile('private-cues/letter.json'))
      .then((response) => {
        if (!response.ok) throw new Error('The local letter is missing');
        return response.json() as Promise<string[]>;
      })
      .then((value) => { setLines(value); continueRender(handle); })
      .catch((error: unknown) => cancelRender(error));
  }, [handle]);

  const letterShot = (t >= 3.3 && t < 15.0) || (t >= 16.7 && t < 23.1);
  return <Stage>
    {t < 1.05 ? <>
      <rect width="1280" height="720" fill="#b99778"/><ellipse cx="635" cy="493" rx="370" ry="117" fill={C.cream} stroke={C.ink} strokeWidth="7"/><ellipse cx="635" cy="480" rx="245" ry="58" fill="#d0c0a5"/>
      <g transform={`translate(630 ${240+230*ease(t,.12,.9)}) rotate(${25*ease(t,.2,1)})`} fill="none" stroke={C.ink} strokeWidth="8"><circle r="27"/><path d="M17 19 L80 95 M41 50 L25 65 M56 66 L41 82"/></g>
      <path d="M1280 10 Q1050 35 850 170 L680 240" fill="none" stroke="#e0ddcd" strokeWidth="110" strokeLinecap="round"/><circle cx="680" cy="240" r="44" fill="#e8b99a" stroke={C.ink} strokeWidth="4"/>
    </> : t < 2.4 ? <>
      <Wall color="#d6bea3" floor="#b28c71"/><Window x={900} y={75} w={245} h={285}/><Table x={165} y={510} w={950}/><Vase x={880} y={496}/>
      <g transform="translate(430 360) rotate(-3)"><path d="M0 140 L235 140 L205 0 L30 0Z" fill={C.cream} stroke={C.ink} strokeWidth="5"/><text x="118" y="84" textAnchor="middle" fontSize="40" fontFamily="Georgia, serif" fontStyle="italic" fill={C.ink}>Colin</text></g>
    </> : t < 3.3 ? <>
      <Wall color="#d6bea3"/><Person x={485} y={620} scale={1.45} mood="sad" arm={-60} tilt={9}/><g transform="translate(525 370) rotate(12)"><rect width="240" height="155" fill={C.cream} stroke={C.ink} strokeWidth="5"/><path d="M20 30 H210 M20 57 H180 M20 84 H200" stroke="#b5aa99" strokeWidth="5"/></g>
    </> : letterShot ? <>
      <rect width="1280" height="720" fill="#647971"/>
      <g transform="translate(159 55) rotate(-1 480 300)">
        <rect x="12" y="16" width="962" height="598" rx="2" fill={C.ink} opacity=".2"/>
        <rect width="962" height="598" rx="2" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
        <rect x="24" y="24" width="914" height="550" fill="none" stroke="#cbbb9d" strokeWidth="2"/>
        <text x="74" y="65" fontFamily="Georgia, serif" fontSize="18" letterSpacing="5" fill="#a38c77">A LETTER</text>
        {lines.length > 0 ? lines.map((line, i) => <text key={i} x={i===6 ? 615 : 76} y={130 + i*59} fontFamily="Georgia, serif" fontSize="30" fontStyle="italic" fill={C.ink}>{line}</text>) : <g stroke="#a18f7b" strokeWidth="5" strokeLinecap="round" opacity=".65">
          <path d="M76 135 h250 M76 194 h700 M76 253 h740 M76 312 h540 M76 371 h680 M76 430 h380 M615 500 h190"/>
        </g>}
        <path d="M0 0 q-25 -35 -51 0 q25 23 51 45 q26 -22 51 -45 q-26 -35 -51 0" transform="translate(855 525) scale(.55)" fill={C.coral} opacity=".65"/>
      </g>
    </> : <>
      <rect width="1280" height="720" fill="#bdad98"/><path d="M185 0 H920 V720 H185Z" fill="#8b9283"/><path d="M945 0 V720" stroke={C.cream} strokeWidth="24"/>
      <ColinClose x={545} y={310} scale={2.05} mood="sad" tilt={-2}/>
      <g transform="translate(300 470) rotate(-11)"><rect width="250" height="178" fill={C.cream} stroke={C.ink} strokeWidth="5"/><path d="M22 36 H218 M22 64 H201 M22 92 H211" stroke="#b8aa97" strokeWidth="5"/></g>
    </>}
  </Stage>;
};
