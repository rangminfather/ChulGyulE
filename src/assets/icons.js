import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

// Tab bar icons (line style)
export const IconCalendar = ({ size=24, color='#C4B5A9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="2.5" stroke={color} strokeWidth="1.8" />
    <Path d="M3 9h18" stroke={color} strokeWidth="1.8" />
    <Circle cx="8" cy="13.5" r="1.2" fill={color} />
    <Circle cx="12" cy="13.5" r="1.2" fill={color} />
    <Circle cx="16" cy="13.5" r="1.2" fill={color} />
    <Circle cx="8" cy="17.5" r="1.2" fill={color} />
    <Line x1="8" y1="2" x2="8" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="16" y1="2" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const IconPlus = ({ size=24, color='#C4B5A9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const IconChart = ({ size=24, color='#C4B5A9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="12" width="4" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <Rect x="10" y="8" width="4" height="12" rx="1" stroke={color} strokeWidth="1.8" />
    <Rect x="16" y="4" width="4" height="16" rx="1" stroke={color} strokeWidth="1.8" />
  </Svg>
);

export const IconSettings = ({ size=24, color='#C4B5A9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

// UI icons
export const IconChevronLeft = ({ size=20, color='#C07A54' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconChevronRight = ({ size=20, color='#C07A54' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M7 4l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconChevronDoubleLeft = ({ size=20, color='#C07A54' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M11 4l-6 6 6 6M17 4l-6 6 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconChevronDoubleRight = ({ size=20, color='#C07A54' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M9 4l6 6-6 6M3 4l6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconDownload = ({ size=20, color='#FF9A6C' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M10 3v10M7 10l3 3 3-3M4 15h12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconUpload = ({ size=20, color='#FF9A6C' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M10 13V3M7 6l3-3 3 3M4 15h12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconClose = ({ size=20, color='#9E8E82' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M5 5l10 10M15 5L5 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const IconCheck = ({ size=16, color='#43A047' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path d="M3.5 8.5l3 3 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconTrash = ({ size=20, color='#E53935' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M4 6h12M8 6V4h4v2M6 6v10a1 1 0 001 1h6a1 1 0 001-1V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconEdit = ({ size=18, color='#FF9A6C' }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M11 3l4 4-9 9H2v-4l9-9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </Svg>
);

export const IconMinus = ({ size=20, color='#3D3531' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M6 10h8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const IconPlusMath = ({ size=20, color='#3D3531' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M10 6v8M6 10h8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const IconTicket = ({ size=16, color='#5E35B1' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Rect x="1" y="3" width="14" height="10" rx="2" stroke={color} strokeWidth="1.3" />
    <Path d="M6 3v10M10 3v10" stroke={color} strokeWidth="1" strokeDasharray="2 1.5" />
  </Svg>
);

export const IconBox = ({ size=16, color='#1E88E5' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Rect x="2" y="5" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.3" />
    <Path d="M2 5l6-3 6 3" stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill="none" />
    <Path d="M8 2v6" stroke={color} strokeWidth="1" />
  </Svg>
);
