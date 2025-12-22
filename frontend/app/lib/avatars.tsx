import React from 'react';

export type AvatarId =
  | 'firework'
  | 'sparkle'
  | 'party-hat'
  | 'lantern'
  | 'snowflake'
  | 'penguin-party'
  | 'polar-bear-party'
  | 'rabbit-party'
  | 'cat-confetti'
  | 'fox-scarf'
  | 'champagne-pop'
  | 'midnight-star';

export type AvatarSpec = {
  id: AvatarId;
  name: string;
  group: 'object' | 'animal' | 'mascot';
};

export const AVATARS: AvatarSpec[] = [
  { id: 'firework', name: 'Firework', group: 'object' },
  { id: 'sparkle', name: 'Sparkle', group: 'object' },
  { id: 'party-hat', name: 'Party Hat', group: 'object' },
  { id: 'lantern', name: 'Lantern', group: 'object' },
  { id: 'snowflake', name: 'Snowflake', group: 'object' },
  { id: 'midnight-star', name: 'Midnight Star', group: 'mascot' },
  { id: 'champagne-pop', name: 'Pop!', group: 'mascot' },
  { id: 'penguin-party', name: 'Penguin', group: 'animal' },
  { id: 'polar-bear-party', name: 'Polar Bear', group: 'animal' },
  { id: 'rabbit-party', name: 'Rabbit', group: 'animal' },
  { id: 'cat-confetti', name: 'Cat', group: 'animal' },
  { id: 'fox-scarf', name: 'Fox', group: 'animal' }
];

function SvgBase({
  children,
  title,
  className
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function Firework({ className }: { className?: string }) {
  return (
    <SvgBase title="Firework" className={className}>
      <g className="text-gold" fill="currentColor">
        <circle cx="32" cy="22" r="4" />
        <path d="M32 6c1 0 1.6.6 1.6 1.6V16a1.6 1.6 0 1 1-3.2 0V7.6C30.4 6.6 31 6 32 6z" />
        <path d="M16 22a1.6 1.6 0 0 1 1.6-1.6H26a1.6 1.6 0 1 1 0 3.2h-8.4A1.6 1.6 0 0 1 16 22z" />
        <path d="M38 22a1.6 1.6 0 0 1 1.6-1.6H48a1.6 1.6 0 1 1 0 3.2h-8.4A1.6 1.6 0 0 1 38 22z" />
        <path d="M20.6 10.6a1.6 1.6 0 0 1 2.3 0l5.9 5.9a1.6 1.6 0 1 1-2.3 2.3l-5.9-5.9a1.6 1.6 0 0 1 0-2.3z" />
        <path d="M41.1 16.5l5.9-5.9a1.6 1.6 0 0 1 2.3 2.3l-5.9 5.9a1.6 1.6 0 0 1-2.3-2.3z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.9">
        <path d="M30 28c0-1.1.9-2 2-2s2 .9 2 2v23a3 3 0 0 1-6 0V28z" />
      </g>
      <g className="text-pine" fill="currentColor" opacity="0.95">
        <path d="M29 40h6l3 2-3 2h-6l-3-2 3-2z" />
      </g>
    </SvgBase>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <SvgBase title="Sparkle" className={className}>
      <g className="text-gold" fill="currentColor">
        <path d="M32 8l4.2 13.2L50 26l-13.8 4.8L32 44l-4.2-13.2L14 26l13.8-4.8L32 8z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.9">
        <circle cx="50" cy="14" r="2.2" />
        <circle cx="14" cy="46" r="2.2" />
        <circle cx="46" cy="46" r="1.8" />
      </g>
    </SvgBase>
  );
}

function PartyHat({ className }: { className?: string }) {
  return (
    <SvgBase title="Party Hat" className={className}>
      <g className="text-winter-purple" fill="currentColor">
        <path d="M32 10c-8 9-13.8 20-16.8 33.2a2.2 2.2 0 0 0 1.7 2.6c9.8 2 20.4 2 30.2 0a2.2 2.2 0 0 0 1.7-2.6C45.8 30 40 19 32 10z" />
      </g>
      <g className="text-gold" fill="currentColor">
        <circle cx="32" cy="10" r="3.2" />
        <path d="M22 36h20l-2 4H24l-2-4z" opacity="0.9" />
        <circle cx="24" cy="30" r="2" />
        <circle cx="40" cy="30" r="2" />
        <circle cx="32" cy="28" r="1.6" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.9">
        <path d="M20 46c4.3 3.3 9.7 5 12 5s7.7-1.7 12-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </SvgBase>
  );
}

function Lantern({ className }: { className?: string }) {
  return (
    <SvgBase title="Lantern" className={className}>
      <g className="text-gold" fill="currentColor">
        <path d="M28 8h8l2 6H26l2-6z" />
        <path d="M24 18c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v24c0 7-3.6 14-8 14s-8-7-8-14V18z" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.35">
        <path d="M30 20h4v22h-4V20z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.9">
        <path d="M26 48c3 2.2 6 3.4 6 3.4S35 50.2 38 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </SvgBase>
  );
}

function Snowflake({ className }: { className?: string }) {
  return (
    <SvgBase title="Snowflake" className={className}>
      <g className="text-snow" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M32 10v44" />
        <path d="M14 20l36 24" />
        <path d="M50 20L14 44" />
        <path d="M32 10l-4 4" />
        <path d="M32 10l4 4" />
        <path d="M32 54l-4-4" />
        <path d="M32 54l4-4" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.9">
        <circle cx="32" cy="32" r="3.4" />
      </g>
    </SvgBase>
  );
}

function MidnightStar({ className }: { className?: string }) {
  return (
    <SvgBase title="Midnight Star" className={className}>
      <g className="text-midnight-light" fill="currentColor">
        <path d="M32 8c11.6 0 21 9.4 21 21s-9.4 21-21 21S11 40.6 11 29 20.4 8 32 8z" />
      </g>
      <g className="text-gold" fill="currentColor">
        <path d="M32 16l3.2 9.8L45 29l-9.8 3.2L32 42l-3.2-9.8L19 29l9.8-3.2L32 16z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.9">
        <circle cx="22" cy="26" r="2" />
        <circle cx="44" cy="24" r="1.6" />
        <circle cx="42" cy="40" r="1.8" />
      </g>
    </SvgBase>
  );
}

function ChampagnePop({ className }: { className?: string }) {
  return (
    <SvgBase title="Champagne" className={className}>
      <g className="text-snow" fill="currentColor" opacity="0.95">
        <path d="M24 10h16l-2 20c-.5 5-4.5 9-6 9s-5.5-4-6-9l-2-20z" />
        <path d="M29 39h6v9c0 3 2.5 5.6 6.2 6H22.8c3.7-.4 6.2-3 6.2-6v-9z" />
      </g>
      <g className="text-gold" fill="currentColor">
        <path d="M22 12h20l-.6 6H22.6L22 12z" opacity="0.65" />
        <circle cx="50" cy="14" r="2.3" />
        <circle cx="46" cy="20" r="1.8" />
        <circle cx="52" cy="22" r="1.6" />
      </g>
      <g className="text-winter-purple" fill="currentColor" opacity="0.8">
        <path d="M44 10c2.8 3 3.8 5.6 3.2 8.2-2.3-1-4-2.3-5-4 1.1-1.4 1.8-2.7 1.8-4.2z" />
      </g>
    </SvgBase>
  );
}

function PenguinParty({ className }: { className?: string }) {
  return (
    <SvgBase title="Penguin" className={className}>
      <g className="text-midnight" fill="currentColor">
        <path d="M32 12c9 0 15 8 15 18s-6 22-15 22-15-12-15-22 6-18 15-18z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.96">
        <path d="M32 18c5.8 0 9.4 5.5 9.4 12.4S37.8 48 32 48s-9.4-10.7-9.4-17.6S26.2 18 32 18z" />
        <circle cx="26" cy="28" r="2" />
        <circle cx="38" cy="28" r="2" />
      </g>
      <g className="text-gold" fill="currentColor">
        <path d="M32 30l5 3-5 3-5-3 5-3z" />
      </g>
      <g className="text-winter-purple" fill="currentColor">
        <path d="M32 6c-6 6-9.4 12-10 17 2.8-1.9 6-3 10-3s7.2 1.1 10 3c-.6-5-4-11-10-17z" opacity="0.9" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.9">
        <circle cx="32" cy="7" r="2.2" />
      </g>
    </SvgBase>
  );
}

function PolarBearParty({ className }: { className?: string }) {
  return (
    <SvgBase title="Polar Bear" className={className}>
      <g className="text-snow" fill="currentColor">
        <path d="M20 28c0-8 5.4-14 12-14s12 6 12 14-5.4 22-12 22-12-14-12-22z" />
        <circle cx="22" cy="18" r="4" />
        <circle cx="42" cy="18" r="4" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.75">
        <circle cx="28" cy="28" r="2" />
        <circle cx="36" cy="28" r="2" />
        <path d="M32 30c2.2 0 4 1.8 4 4 0 2.8-2.3 5-4 5s-4-2.2-4-5c0-2.2 1.8-4 4-4z" />
      </g>
      <g className="text-winter-blue" fill="currentColor" opacity="0.9">
        <path d="M32 8c-7 5-10 10-10.6 14.8 3-1.6 6.6-2.5 10.6-2.5s7.6.9 10.6 2.5C42 18 39 13 32 8z" />
      </g>
      <g className="text-gold" fill="currentColor">
        <circle cx="32" cy="9" r="2.2" />
      </g>
    </SvgBase>
  );
}

function RabbitParty({ className }: { className?: string }) {
  return (
    <SvgBase title="Rabbit" className={className}>
      <g className="text-snow" fill="currentColor">
        <path d="M18 30c0-8 6.3-14 14-14s14 6 14 14-6.3 20-14 20-14-12-14-20z" />
        <path d="M22 10c2 0 4 3 4 8 0 4-1.2 8-3 10-2-2-3-6-3-10 0-5 0-8 2-8z" />
        <path d="M42 10c2 0 2 3 2 8 0 4-1 8-3 10-1.8-2-3-6-3-10 0-5 2-8 4-8z" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.75">
        <circle cx="27" cy="30" r="2" />
        <circle cx="37" cy="30" r="2" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.95">
        <path d="M32 32l2.8 2.2L32 36.6l-2.8-2.4L32 32z" />
      </g>
      <g className="text-winter-purple" fill="currentColor" opacity="0.85">
        <path d="M32 12c-6 5-9.5 9.5-10.3 13.6 3-1.7 6.6-2.6 10.3-2.6s7.3.9 10.3 2.6C41.5 21.5 38 17 32 12z" />
      </g>
    </SvgBase>
  );
}

function CatConfetti({ className }: { className?: string }) {
  return (
    <SvgBase title="Cat" className={className}>
      <g className="text-midnight" fill="currentColor">
        <path d="M16 28c0-7 6.5-13 16-13s16 6 16 13-6.5 22-16 22-16-15-16-22z" />
        <path d="M20 18l6-6v10" />
        <path d="M44 18l-6-6v10" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.92">
        <circle cx="27" cy="30" r="2" />
        <circle cx="37" cy="30" r="2" />
        <path d="M24 38c2.2 1.6 5 2.4 8 2.4s5.8-.8 8-2.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.95">
        <circle cx="18" cy="20" r="1.6" />
        <circle cx="48" cy="24" r="1.6" />
        <circle cx="44" cy="46" r="1.4" />
      </g>
    </SvgBase>
  );
}

function FoxScarf({ className }: { className?: string }) {
  return (
    <SvgBase title="Fox" className={className}>
      <g className="text-gold" fill="currentColor">
        <path d="M32 14c8 0 16 6 16 16S40 50 32 50 16 40 16 30s8-16 16-16z" />
        <path d="M18 22l6-8v12" />
        <path d="M46 22l-6-8v12" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.92">
        <path d="M32 24c5.6 0 10.2 4 10.2 9 0 6-4.8 12-10.2 12S21.8 39 21.8 33c0-5 4.6-9 10.2-9z" />
        <circle cx="27" cy="30" r="2" />
        <circle cx="37" cy="30" r="2" />
      </g>
      <g className="text-pine" fill="currentColor" opacity="0.9">
        <path d="M20 44h24l-3 6H23l-3-6z" />
        <path d="M26 44l4 10" opacity="0.9" />
      </g>
    </SvgBase>
  );
}

const RENDERERS: Record<AvatarId, (props: { className?: string }) => React.ReactElement> = {
  firework: Firework,
  sparkle: Sparkle,
  'party-hat': PartyHat,
  lantern: Lantern,
  snowflake: Snowflake,
  'midnight-star': MidnightStar,
  'champagne-pop': ChampagnePop,
  'penguin-party': PenguinParty,
  'polar-bear-party': PolarBearParty,
  'rabbit-party': RabbitParty,
  'cat-confetti': CatConfetti,
  'fox-scarf': FoxScarf
};

export function isAvatarId(value: string): value is AvatarId {
  return AVATARS.some((a) => a.id === value);
}

export function AvatarIcon({
  avatarId,
  className,
  title,
  frame = true
}: {
  avatarId: string | null | undefined;
  className?: string;
  title?: string;
  frame?: boolean;
}) {
  const id: AvatarId = isAvatarId(String(avatarId ?? '')) ? (avatarId as AvatarId) : 'firework';
  const Renderer = RENDERERS[id];

  const frameClass = frame
    ? 'inline-flex items-center justify-center rounded-full bg-white/10 border border-white/15 '
    : 'inline-flex items-center justify-center ';

  return (
    <span
      className={frameClass + (className ?? '')}
      title={title ?? AVATARS.find((a) => a.id === id)?.name ?? 'Avatar'}
    >
      <Renderer className="h-full w-full p-2" />
    </span>
  );
}
