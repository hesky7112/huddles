import React from 'react';

function getHue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 360;
  }
  return h;
}

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({ seed, size = 40, className = '', style = {} }) => {
  const safeSeed = seed || 'default';
  const h = getHue(safeSeed);
  const k = safeSeed.length % 3;
  const skintones = ['#f1c9a5', '#d9a47a', '#a8744f', '#f6dcc3'];
  const skin = skintones[h % skintones.length];

  const hairOptions = [
    <path key="h1" d="M14 30c0-14 8-20 18-20s18 6 18 20c-6-8-30-8-36 0z" />,
    <circle key="h2" cx="32" cy="16" r="19" />,
    <path key="h3" d="M12 36c-2-20 10-28 20-28s22 8 20 28c-4-10-8-16-20-16s-16 6-20 16z" />
  ];

  const bgColor = `hsl(${h}, 70%, 62%)`;
  const hairColor = `hsl(${(h + 160) % 360}, 35%, 22%)`;
  const shirtColor = `hsl(${(h + 200) % 360}, 55%, 45%)`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`rounded-full shrink-0 select-none overflow-hidden ${className}`}
      style={style}
    >
      <rect width="64" height="64" fill={bgColor} />
      <circle cx="32" cy="34" r="17" fill={skin} />
      <g fill={hairColor}>{hairOptions[k]}</g>
      <circle cx="26" cy="35" r="2" fill="#222" />
      <circle cx="38" cy="35" r="2" fill="#222" />
      <path
        d={`M26 42q6 ${4 + k * 2} 12 0`}
        stroke="#222"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="14" y="52" width="36" height="14" rx="9" fill={shirtColor} />
    </svg>
  );
};
