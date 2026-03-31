import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, G, Defs, ClipPath } from 'react-native-svg';

// ─── KID AVATARS ───
// Each returns an SVG component. size defaults to 40.
// Style: Round pastel faces with simple cute features

const kidBase = (bg, skin, hair, hairPath, eyes, mouth, blush, size) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Circle cx="24" cy="24" r="23" fill={bg} />
    <Circle cx="24" cy="25" r="16" fill={skin} />
    {hairPath}
    {eyes}
    {mouth}
    {blush && <><Circle cx="15" cy="30" r="3" fill={blush} opacity="0.4" /><Circle cx="33" cy="30" r="3" fill={blush} opacity="0.4" /></>}
  </Svg>
);

const eyeDots = (lx=19, rx=29, y=26, color='#5D4037') => (
  <><Circle cx={lx} cy={y} r="1.8" fill={color} /><Circle cx={rx} cy={y} r="1.8" fill={color} /></>
);

const happyMouth = (cx=24, cy=32) => (
  <Path d={`M${cx-3} ${cy}c0 0 1.5 2.5 3 2.5s3-2.5 3-2.5`} stroke="#E8835A" strokeWidth="1" fill="none" strokeLinecap="round" />
);

const smileMouth = (cx=24, cy=32) => (
  <Path d={`M${cx-2.5} ${cy}c0 0 1.2 2 2.5 2s2.5-2 2.5-2`} stroke="#D4715A" strokeWidth="1" fill="none" strokeLinecap="round" />
);

export const KID_AVATARS = [
  // 0: Boy with short brown hair
  { id: 'kid_boy1', label: '남자아이1', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FFE8D6" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M10 20c0-8 6-14 14-14s14 6 14 14c0 2-1 3-2 3h-3c0-5-4-9-9-9s-9 4-9 9h-3c-1 0-2-1-2-3z" fill="#8D6E63" />
      {eyeDots()}
      {happyMouth()}
      <Circle cx="15" cy="31" r="3" fill="#FFAA80" opacity="0.4" />
      <Circle cx="33" cy="31" r="3" fill="#FFAA80" opacity="0.4" />
    </Svg>
  )},
  // 1: Girl with pigtails
  { id: 'kid_girl1', label: '여자아이1', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FCE4EC" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M10 22c0-8 6-14 14-14s14 6 14 14v2h-4c0-5.5-4.5-10-10-10S14 18.5 14 24h-4v-2z" fill="#5D4037" />
      <Circle cx="10" cy="18" r="5" fill="#5D4037" /><Circle cx="38" cy="18" r="5" fill="#5D4037" />
      <Circle cx="10" cy="16" r="2.5" fill="#EC407A" /><Circle cx="38" cy="16" r="2.5" fill="#EC407A" />
      {eyeDots()}
      {smileMouth()}
      <Circle cx="15" cy="31" r="3" fill="#F48FB1" opacity="0.35" />
      <Circle cx="33" cy="31" r="3" fill="#F48FB1" opacity="0.35" />
    </Svg>
  )},
  // 2: Boy with cap
  { id: 'kid_boy2', label: '남자아이2', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E3F2FD" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M10 22c0-7 6-13 14-13s14 6 14 13H10z" fill="#42A5F5" />
      <Rect x="8" y="21" width="32" height="3" rx="1.5" fill="#1E88E5" />
      <Rect x="30" y="16" width="10" height="3" rx="1.5" fill="#1E88E5" />
      {eyeDots(19,29,27)}
      {happyMouth(24,33)}
      <Circle cx="15" cy="32" r="3" fill="#FFAA80" opacity="0.4" />
      <Circle cx="33" cy="32" r="3" fill="#FFAA80" opacity="0.4" />
    </Svg>
  )},
  // 3: Girl with bob
  { id: 'kid_girl2', label: '여자아이2', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FFF3E0" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M9 24c0-9 6.7-15 15-15s15 6 15 15c0 2-1 6-3 8V24c0-6.6-5.4-12-12-12S12 17.4 12 24v8c-2-2-3-6-3-8z" fill="#FF8A65" />
      <Rect x="9" y="24" width="4" height="10" rx="2" fill="#FF8A65" />
      <Rect x="35" y="24" width="4" height="10" rx="2" fill="#FF8A65" />
      {eyeDots()}
      {smileMouth()}
      <Circle cx="15" cy="31" r="3" fill="#FFAB91" opacity="0.35" />
      <Circle cx="33" cy="31" r="3" fill="#FFAB91" opacity="0.35" />
    </Svg>
  )},
  // 4: Toddler curly
  { id: 'kid_baby', label: '아기', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#F3E5F5" />
      <Circle cx="24" cy="26" r="15" fill="#FFD5C2" />
      <Circle cx="16" cy="14" r="4" fill="#BCAAA4" />
      <Circle cx="24" cy="11" r="4.5" fill="#BCAAA4" />
      <Circle cx="32" cy="14" r="4" fill="#BCAAA4" />
      <Circle cx="20" cy="12" r="3" fill="#BCAAA4" />
      <Circle cx="28" cy="12" r="3" fill="#BCAAA4" />
      <Circle cx="19" cy="26" r="1.5" fill="#5D4037" />
      <Circle cx="29" cy="26" r="1.5" fill="#5D4037" />
      <Ellipse cx="24" cy="32" rx="2" ry="1.5" fill="#FFAB91" opacity="0.6" />
      <Circle cx="15" cy="30" r="3.5" fill="#CE93D8" opacity="0.3" />
      <Circle cx="33" cy="30" r="3.5" fill="#CE93D8" opacity="0.3" />
    </Svg>
  )},
  // 5: Cool boy with spiky hair
  { id: 'kid_boy3', label: '남자아이3', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E8F5E9" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M14 20l3-10 4 7 3-8 3 8 4-7 3 10H14z" fill="#66BB6A" />
      <Path d="M11 22c1-6 6-11 13-11s12 5 13 11H11z" fill="#388E3C" />
      {eyeDots(19,29,27)}
      <Path d="M21 33h6" stroke="#E8835A" strokeWidth="1.2" strokeLinecap="round" />
      <Circle cx="15" cy="31" r="3" fill="#A5D6A7" opacity="0.35" />
      <Circle cx="33" cy="31" r="3" fill="#A5D6A7" opacity="0.35" />
    </Svg>
  )},
  // 6: Girl with long hair
  { id: 'kid_girl3', label: '여자아이3', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FFF9C4" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M10 20c0-8.3 6.3-15 14-15s14 6.7 14 15c0 4-1 7-1 7h-2V22c0-6-5-11-11-11S13 16 13 22v5h-2s-1-3-1-7z" fill="#FFB74D" />
      <Rect x="9" y="22" width="4" height="16" rx="2" fill="#FFB74D" />
      <Rect x="35" y="22" width="4" height="16" rx="2" fill="#FFB74D" />
      <Circle cx="24" cy="13" r="2" fill="#FF7043" />
      {eyeDots()}
      {happyMouth()}
      <Circle cx="15" cy="31" r="3" fill="#FFE082" opacity="0.4" />
      <Circle cx="33" cy="31" r="3" fill="#FFE082" opacity="0.4" />
    </Svg>
  )},
  // 7: Boy with glasses
  { id: 'kid_boy4', label: '남자아이4', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E0F2F1" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M11 21c0-7.7 5.8-14 13-14s13 6.3 13 14H11z" fill="#455A64" />
      <Circle cx="19" cy="26" r="5" fill="none" stroke="#455A64" strokeWidth="1.5" />
      <Circle cx="29" cy="26" r="5" fill="none" stroke="#455A64" strokeWidth="1.5" />
      <Path d="M24 26h-0.5M24.5 26H24" stroke="#455A64" strokeWidth="1.5" />
      <Circle cx="19" cy="26" r="1.5" fill="#5D4037" />
      <Circle cx="29" cy="26" r="1.5" fill="#5D4037" />
      {smileMouth(24,33)}
      <Circle cx="15" cy="32" r="3" fill="#80CBC4" opacity="0.35" />
      <Circle cx="33" cy="32" r="3" fill="#80CBC4" opacity="0.35" />
    </Svg>
  )},
  // 8: Twin-tail girl
  { id: 'kid_girl4', label: '여자아이4', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E8EAF6" />
      <Circle cx="24" cy="26" r="15" fill="#FFCBA4" />
      <Path d="M10 20c0-8 6-14 14-14s14 6 14 14c0 1-.5 2-1 3h-4c0-5-4-9-9-9s-9 4-9 9h-4c-.5-1-1-2-1-3z" fill="#7986CB" />
      <Rect x="6" y="18" width="5" height="14" rx="2.5" fill="#7986CB" />
      <Rect x="37" y="18" width="5" height="14" rx="2.5" fill="#7986CB" />
      <Circle cx="8.5" cy="17" r="2.5" fill="#FF80AB" />
      <Circle cx="39.5" cy="17" r="2.5" fill="#FF80AB" />
      {eyeDots()}
      {happyMouth()}
      <Circle cx="15" cy="31" r="3" fill="#C5CAE9" opacity="0.35" />
      <Circle cx="33" cy="31" r="3" fill="#C5CAE9" opacity="0.35" />
    </Svg>
  )},
  // 9: Cat kid
  { id: 'kid_cat', label: '고양이', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FFF3E0" />
      <Circle cx="24" cy="27" r="14" fill="#FFE0B2" />
      <Path d="M12 10l4 12h-6z" fill="#FFE0B2" stroke="#FFCC80" strokeWidth="0.5" />
      <Path d="M36 10l-4 12h6z" fill="#FFE0B2" stroke="#FFCC80" strokeWidth="0.5" />
      <Path d="M13 12l3 8" stroke="#FFAB91" strokeWidth="1" />
      <Path d="M35 12l-3 8" stroke="#FFAB91" strokeWidth="1" />
      <Ellipse cx="19" cy="26" rx="2" ry="2.5" fill="#5D4037" />
      <Ellipse cx="29" cy="26" rx="2" ry="2.5" fill="#5D4037" />
      <Circle cx="19" cy="25.5" r="0.8" fill="#FFF" />
      <Circle cx="29" cy="25.5" r="0.8" fill="#FFF" />
      <Ellipse cx="24" cy="30" rx="1.5" ry="1" fill="#FFAB91" />
      <Path d="M24 31v2M22 32c-2 1-4 0.5-5 0M26 32c2 1 4 0.5 5 0" stroke="#BCAAA4" strokeWidth="0.8" strokeLinecap="round" />
    </Svg>
  )},
  // 10: Bunny kid
  { id: 'kid_bunny', label: '토끼', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FCE4EC" />
      <Rect x="16" y="2" width="6" height="16" rx="3" fill="#FFE0E6" stroke="#F8BBD0" strokeWidth="0.5" />
      <Rect x="26" y="2" width="6" height="16" rx="3" fill="#FFE0E6" stroke="#F8BBD0" strokeWidth="0.5" />
      <Rect x="17.5" y="5" width="3" height="10" rx="1.5" fill="#F48FB1" opacity="0.4" />
      <Rect x="27.5" y="5" width="3" height="10" rx="1.5" fill="#F48FB1" opacity="0.4" />
      <Circle cx="24" cy="28" r="14" fill="#FFF0F3" />
      <Circle cx="19" cy="26" r="1.8" fill="#5D4037" />
      <Circle cx="29" cy="26" r="1.8" fill="#5D4037" />
      <Ellipse cx="24" cy="30.5" rx="1.5" ry="1" fill="#F48FB1" />
      <Path d="M24 31.5v1M22.5 32c-1 0.5-2 0.5-3 0M25.5 32c1 0.5 2 0.5 3 0" stroke="#E0A0B0" strokeWidth="0.6" strokeLinecap="round" />
      <Circle cx="16" cy="29" r="3.5" fill="#F8BBD0" opacity="0.3" />
      <Circle cx="32" cy="29" r="3.5" fill="#F8BBD0" opacity="0.3" />
    </Svg>
  )},
  // 11: Bear kid
  { id: 'kid_bear', label: '곰돌이', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#EFEBE9" />
      <Circle cx="12" cy="12" r="6" fill="#BCAAA4" />
      <Circle cx="12" cy="12" r="3.5" fill="#D7CCC8" />
      <Circle cx="36" cy="12" r="6" fill="#BCAAA4" />
      <Circle cx="36" cy="12" r="3.5" fill="#D7CCC8" />
      <Circle cx="24" cy="27" r="15" fill="#BCAAA4" />
      <Ellipse cx="24" cy="30" rx="8" ry="6" fill="#D7CCC8" />
      <Circle cx="19" cy="25" r="2" fill="#5D4037" />
      <Circle cx="29" cy="25" r="2" fill="#5D4037" />
      <Circle cx="19" cy="24.5" r="0.7" fill="#FFF" />
      <Circle cx="29" cy="24.5" r="0.7" fill="#FFF" />
      <Ellipse cx="24" cy="29" rx="2.5" ry="1.8" fill="#8D6E63" />
      <Path d="M24 30.8v1" stroke="#8D6E63" strokeWidth="0.8" strokeLinecap="round" />
    </Svg>
  )},
  // 12: Penguin
  { id: 'kid_penguin', label: '펭귄', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E1F5FE" />
      <Ellipse cx="24" cy="27" rx="14" ry="16" fill="#37474F" />
      <Ellipse cx="24" cy="30" rx="9" ry="12" fill="#ECEFF1" />
      <Circle cx="19" cy="22" r="2.5" fill="#FFF" />
      <Circle cx="29" cy="22" r="2.5" fill="#FFF" />
      <Circle cx="19.5" cy="22.5" r="1.3" fill="#37474F" />
      <Circle cx="29.5" cy="22.5" r="1.3" fill="#37474F" />
      <Path d="M22 27l2 2 2-2" fill="#FF8F00" stroke="#FF8F00" strokeWidth="0.5" strokeLinejoin="round" />
      <Path d="M10 24c-1 3 0 8 3 10" stroke="#37474F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Path d="M38 24c1 3 0 8-3 10" stroke="#37474F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
  )},
  // 13: Fox
  { id: 'kid_fox', label: '여우', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#FFF3E0" />
      <Path d="M10 8l5 14h-7z" fill="#FF8A65" />
      <Path d="M38 8l-5 14h7z" fill="#FF8A65" />
      <Path d="M11.5 11l3.5 9" stroke="#FFF" strokeWidth="1" />
      <Path d="M36.5 11l-3.5 9" stroke="#FFF" strokeWidth="1" />
      <Circle cx="24" cy="28" r="14" fill="#FF8A65" />
      <Path d="M14 28c0 0 4 10 10 10s10-10 10-10" fill="#FFF" />
      <Circle cx="19" cy="24" r="2" fill="#5D4037" />
      <Circle cx="29" cy="24" r="2" fill="#5D4037" />
      <Circle cx="19.5" cy="23.5" r="0.7" fill="#FFF" />
      <Circle cx="29.5" cy="23.5" r="0.7" fill="#FFF" />
      <Ellipse cx="24" cy="29" rx="2" ry="1.3" fill="#37474F" />
    </Svg>
  )},
  // 14: Dinosaur
  { id: 'kid_dino', label: '공룡', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#E8F5E9" />
      <Circle cx="24" cy="26" r="15" fill="#81C784" />
      <Path d="M18 11l3 5M22 9l2 6M27 10l1 5M31 12l-1 5" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
      <Circle cx="18" cy="24" r="4" fill="#FFF" />
      <Circle cx="30" cy="24" r="4" fill="#FFF" />
      <Circle cx="19" cy="24.5" r="2" fill="#2E7D32" />
      <Circle cx="31" cy="24.5" r="2" fill="#2E7D32" />
      <Path d="M20 32c0 0 2 2 4 2s4-2 4-2" stroke="#2E7D32" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Circle cx="15" cy="30" r="2.5" fill="#A5D6A7" opacity="0.5" />
      <Circle cx="33" cy="30" r="2.5" fill="#A5D6A7" opacity="0.5" />
    </Svg>
  )},
  // 15: Unicorn
  { id: 'kid_unicorn', label: '유니콘', render: (s=40) => (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="23" fill="#F3E5F5" />
      <Circle cx="24" cy="27" r="14" fill="#FFF" stroke="#E1BEE7" strokeWidth="0.5" />
      <Path d="M24 3l-3 12h6z" fill="#FFD54F" />
      <Circle cx="17" cy="14" r="4" fill="#CE93D8" />
      <Circle cx="31" cy="14" r="4" fill="#F48FB1" />
      <Circle cx="24" cy="11" r="3.5" fill="#81D4FA" />
      <Circle cx="20" cy="25" r="1.8" fill="#7B1FA2" />
      <Circle cx="28" cy="25" r="1.8" fill="#7B1FA2" />
      <Path d="M22 31c0 0 1 1.5 2 1.5s2-1.5 2-1.5" stroke="#CE93D8" strokeWidth="1" fill="none" strokeLinecap="round" />
      <Circle cx="15" cy="29" r="3" fill="#F8BBD0" opacity="0.4" />
      <Circle cx="33" cy="29" r="3" fill="#F8BBD0" opacity="0.4" />
    </Svg>
  )},
];

// ─── ACADEMY ICONS ───
// Cute illustrated icons for academy types

export const ACADEMY_ICONS = [
  // 0: Piano
  { id: 'acad_piano', label: '피아노', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="2" y="8" width="32" height="20" rx="3" fill="#FFE0CC" stroke="#FFAA80" strokeWidth="1" />
      <Rect x="6" y="12" width="5" height="12" rx="1" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
      <Rect x="12" y="12" width="5" height="12" rx="1" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
      <Rect x="18" y="12" width="5" height="12" rx="1" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
      <Rect x="24" y="12" width="5" height="12" rx="1" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
      <Rect x="9" y="12" width="3" height="7" rx="0.5" fill="#3D3531" />
      <Rect x="15" y="12" width="3" height="7" rx="0.5" fill="#3D3531" />
      <Rect x="21" y="12" width="3" height="7" rx="0.5" fill="#3D3531" />
      <Rect x="27" y="12" width="3" height="7" rx="0.5" fill="#3D3531" />
    </Svg>
  )},
  // 1: Art
  { id: 'acad_art', label: '미술', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Ellipse cx="18" cy="19" rx="13" ry="12" fill="#FFF9C4" stroke="#FFE082" strokeWidth="1" />
      <Circle cx="10" cy="15" r="3" fill="#EF5350" />
      <Circle cx="17" cy="12" r="2.5" fill="#42A5F5" />
      <Circle cx="24" cy="14" r="2.5" fill="#66BB6A" />
      <Circle cx="14" cy="22" r="2" fill="#FF9800" />
      <Circle cx="22" cy="22" r="2.5" fill="#AB47BC" />
      <Ellipse cx="18" cy="19" rx="2.5" ry="3" fill="#FFF9C4" />
      <Path d="M30 8l-3 14" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" />
      <Path d="M27 22l1.5 2" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )},
  // 2: Math
  { id: 'acad_math', label: '수학', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
      <Path d="M11 12h4M13 10v4" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <Path d="M22 12h4" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <Path d="M11 23l4 4M15 23l-4 4" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <Path d="M22 24h4M22 26h4" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )},
  // 3: English
  { id: 'acad_eng', label: '영어', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#E8F5E9" stroke="#A5D6A7" strokeWidth="1" />
      <Path d="M11 11h5v4h-3v3h3v4h-5" stroke="#388E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M20 11h5l-4 7h5" stroke="#388E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="27" cy="27" r="4" fill="#66BB6A" />
      <Path d="M25.5 27l1 1 2-2" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )},
  // 4: Soccer
  { id: 'acad_soccer', label: '축구', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Circle cx="18" cy="18" r="14" fill="#F1F8E9" stroke="#AED581" strokeWidth="1" />
      <Circle cx="18" cy="18" r="10" fill="#FFF" stroke="#C5E1A5" strokeWidth="0.8" />
      <Path d="M18 8l3 6h-6z" fill="#689F38" opacity="0.6" />
      <Path d="M18 28l-3-6h6z" fill="#689F38" opacity="0.6" />
      <Path d="M9 13l5 2-2 5z" fill="#689F38" opacity="0.5" />
      <Path d="M27 13l-5 2 2 5z" fill="#689F38" opacity="0.5" />
      <Path d="M9 23l5-2-2-5z" fill="#689F38" opacity="0.4" />
      <Path d="M27 23l-5-2 2-5z" fill="#689F38" opacity="0.4" />
    </Svg>
  )},
  // 5: Science
  { id: 'acad_science', label: '과학', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#EDE7F6" stroke="#B39DDB" strokeWidth="1" />
      <Path d="M15 8v10l-5 9h16l-5-9V8" fill="#D1C4E9" stroke="#7E57C2" strokeWidth="1" strokeLinejoin="round" />
      <Rect x="14" y="6" width="8" height="3" rx="1" fill="#7E57C2" />
      <Circle cx="16" cy="24" r="2" fill="#FF8A65" opacity="0.7" />
      <Circle cx="21" cy="22" r="1.5" fill="#4FC3F7" opacity="0.7" />
      <Circle cx="18" cy="26" r="1" fill="#AED581" opacity="0.7" />
    </Svg>
  )},
  // 6: Coding
  { id: 'acad_coding', label: '코딩', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="7" width="28" height="20" rx="3" fill="#263238" />
      <Rect x="6" y="9" width="24" height="14" rx="1.5" fill="#37474F" />
      <Path d="M10 14l3 3-3 3" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M17 20h6" stroke="#AED581" strokeWidth="1.5" strokeLinecap="round" />
      <Rect x="12" y="27" width="12" height="2" rx="1" fill="#546E7A" />
    </Svg>
  )},
  // 7: Swimming
  { id: 'acad_swim', label: '수영', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
      <Path d="M6 22c3-3 6 0 9-3s6 0 9-3 6 0 6 0" stroke="#26C6DA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M6 26c3-3 6 0 9-3s6 0 9-3 6 0 6 0" stroke="#26C6DA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      <Circle cx="18" cy="14" r="4" fill="#FFCBA4" />
      <Path d="M14 18c0 0 2 3 8 1" stroke="#FFCBA4" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="17" cy="13.5" r="0.8" fill="#5D4037" />
      <Circle cx="20" cy="13.5" r="0.8" fill="#5D4037" />
    </Svg>
  )},
  // 8: Taekwondo
  { id: 'acad_tkd', label: '태권도', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#FFEBEE" stroke="#EF9A9A" strokeWidth="1" />
      <Circle cx="18" cy="11" r="4" fill="#FFCBA4" />
      <Rect x="14" y="15" width="8" height="10" rx="2" fill="#FFF" stroke="#EF5350" strokeWidth="0.8" />
      <Path d="M16 15v10" stroke="#1A1A1A" strokeWidth="0.8" />
      <Path d="M22 19l6-4" stroke="#FFCBA4" strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 20l-5 4" stroke="#FFCBA4" strokeWidth="2" strokeLinecap="round" />
      <Rect x="16" y="18" width="3" height="1.5" rx="0.5" fill="#E53935" />
    </Svg>
  )},
  // 9: Violin
  { id: 'acad_violin', label: '바이올린', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#FFF3E0" stroke="#FFCC80" strokeWidth="1" />
      <Ellipse cx="16" cy="14" rx="5" ry="6" fill="#FF8A65" stroke="#E64A19" strokeWidth="0.6" />
      <Ellipse cx="16" cy="24" rx="6" ry="7" fill="#FF8A65" stroke="#E64A19" strokeWidth="0.6" />
      <Rect x="15" y="9" width="2" height="22" rx="0.5" fill="#5D4037" />
      <Rect x="10" y="7" width="12" height="2" rx="1" fill="#8D6E63" />
      <Ellipse cx="16" cy="19" rx="3" ry="1.5" fill="#FFF3E0" />
      <Path d="M14 17v4M18 17v4" stroke="#E64A19" strokeWidth="0.5" />
      <Path d="M26 6l-8 24" stroke="#795548" strokeWidth="1" strokeLinecap="round" />
    </Svg>
  )},
  // 10: Dance/Ballet
  { id: 'acad_dance', label: '발레/댄스', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#FCE4EC" stroke="#F8BBD0" strokeWidth="1" />
      <Circle cx="18" cy="10" r="3.5" fill="#FFCBA4" />
      <Path d="M18 13.5v5" stroke="#F48FB1" strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 16l4 2.5 4-2.5" stroke="#F48FB1" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M13 18.5c0 0 2 9 5 9s5-9 5-9" fill="#F8BBD0" stroke="#EC407A" strokeWidth="0.6" />
      <Path d="M15 27.5l-2 3M21 27.5l2 3" stroke="#FFCBA4" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )},
  // 11: Reading/Korean
  { id: 'acad_reading', label: '독서/국어', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <Path d="M7 10c4 2 8 0 11-1v18c-3 1-7 3-11 1V10z" fill="#FFCC80" stroke="#FFB74D" strokeWidth="0.6" />
      <Path d="M29 10c-4 2-8 0-11-1v18c3 1 7 3 11 1V10z" fill="#FFE0B2" stroke="#FFB74D" strokeWidth="0.6" />
      <Path d="M10 14h5M10 17h4M10 20h5" stroke="#F57F17" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <Path d="M22 14h5M22 17h4M22 20h3" stroke="#F57F17" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </Svg>
  )},
  // 12: Basketball
  { id: 'acad_basket', label: '농구', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Circle cx="18" cy="18" r="14" fill="#FFF3E0" stroke="#FFCC80" strokeWidth="1" />
      <Circle cx="18" cy="18" r="10" fill="#FF8A65" />
      <Path d="M8 18h20" stroke="#BF360C" strokeWidth="0.8" />
      <Path d="M18 8v20" stroke="#BF360C" strokeWidth="0.8" />
      <Path d="M10 10c4 4 4 12 0 16" stroke="#BF360C" strokeWidth="0.8" fill="none" />
      <Path d="M26 10c-4 4-4 12 0 16" stroke="#BF360C" strokeWidth="0.8" fill="none" />
    </Svg>
  )},
  // 13: Writing/Essay
  { id: 'acad_write', label: '논술', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#E8EAF6" stroke="#C5CAE9" strokeWidth="1" />
      <Rect x="9" y="7" width="18" height="22" rx="2" fill="#FFF" stroke="#9FA8DA" strokeWidth="0.8" />
      <Path d="M12 12h12M12 16h10M12 20h8M12 24h11" stroke="#7986CB" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <Path d="M26 22l2-8 2 1-2 8z" fill="#FF8A65" />
      <Path d="M26 22l0.3 0.8-2.3 0.5" fill="#FFE082" />
    </Svg>
  )},
  // 14: Robot/STEM
  { id: 'acad_robot', label: '로봇/STEM', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#E0F2F1" stroke="#80CBC4" strokeWidth="1" />
      <Rect x="11" y="12" width="14" height="14" rx="3" fill="#B2DFDB" stroke="#4DB6AC" strokeWidth="0.8" />
      <Rect x="16" y="7" width="4" height="5" rx="1" fill="#4DB6AC" />
      <Circle cx="18" cy="6" r="2" fill="#4DB6AC" />
      <Circle cx="15.5" cy="18" r="2.5" fill="#FFF" stroke="#00897B" strokeWidth="0.6" />
      <Circle cx="20.5" cy="18" r="2.5" fill="#FFF" stroke="#00897B" strokeWidth="0.6" />
      <Circle cx="15.5" cy="18.3" r="1" fill="#00897B" />
      <Circle cx="20.5" cy="18.3" r="1" fill="#00897B" />
      <Rect x="15" y="22" width="6" height="2" rx="1" fill="#4DB6AC" />
      <Rect x="8" y="16" width="3" height="6" rx="1.5" fill="#4DB6AC" />
      <Rect x="25" y="16" width="3" height="6" rx="1.5" fill="#4DB6AC" />
    </Svg>
  )},
  // 15: Guitar
  { id: 'acad_guitar', label: '기타', render: (s=36) => (
    <Svg width={s} height={s} viewBox="0 0 36 36">
      <Rect x="4" y="4" width="28" height="28" rx="6" fill="#EFEBE9" stroke="#D7CCC8" strokeWidth="1" />
      <Rect x="16.5" y="4" width="3" height="16" rx="1" fill="#8D6E63" />
      <Rect x="14" y="4" width="8" height="3" rx="1" fill="#A1887F" />
      <Circle cx="12" cy="6" r="1.2" fill="#6D4C41" />
      <Circle cx="24" cy="6" r="1.2" fill="#6D4C41" />
      <Ellipse cx="18" cy="24" rx="8" ry="8" fill="#FFCC80" stroke="#FF8F00" strokeWidth="0.8" />
      <Circle cx="18" cy="24" r="3" fill="#5D4037" />
      <Circle cx="18" cy="24" r="1.5" fill="#8D6E63" />
    </Svg>
  )},
];

// Helper to get avatar/icon by id
export const getKidAvatar = (id, size=40) => {
  const found = KID_AVATARS.find(a => a.id === id);
  return found ? found.render(size) : KID_AVATARS[0].render(size);
};

export const getAcadIcon = (id, size=36) => {
  const found = ACADEMY_ICONS.find(a => a.id === id);
  return found ? found.render(size) : ACADEMY_ICONS[0].render(size);
};
