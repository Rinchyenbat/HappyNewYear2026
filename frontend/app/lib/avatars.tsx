import React from 'react';

export type AvatarId =
  | 'penguin-01'
  | 'penguin-02'
  | 'penguin-03'
  | 'penguin-04'
  | 'penguin-05'
  | 'polar-bear-01'
  | 'polar-bear-02'
  | 'polar-bear-03'
  | 'polar-bear-04'
  | 'polar-bear-05'
  | 'rabbit-01'
  | 'rabbit-02'
  | 'rabbit-03'
  | 'rabbit-04'
  | 'rabbit-05'
  | 'cat-01'
  | 'cat-02'
  | 'cat-03'
  | 'cat-04'
  | 'cat-05'
  | 'fox-01'
  | 'fox-02'
  | 'fox-03'
  | 'fox-04'
  | 'fox-05'
  | 'deer-01'
  | 'deer-02'
  | 'deer-03'
  | 'deer-04'
  | 'deer-05';

export type AvatarSpec = {
  id: AvatarId;
  name: string;
  group: 'animal';
};

export const AVATARS: AvatarSpec[] = [
  { id: 'penguin-01', name: 'Penguin (01)', group: 'animal' },
  { id: 'penguin-02', name: 'Penguin (02)', group: 'animal' },
  { id: 'penguin-03', name: 'Penguin (03)', group: 'animal' },
  { id: 'penguin-04', name: 'Penguin (04)', group: 'animal' },
  { id: 'penguin-05', name: 'Penguin (05)', group: 'animal' },
  { id: 'polar-bear-01', name: 'Polar Bear (01)', group: 'animal' },
  { id: 'polar-bear-02', name: 'Polar Bear (02)', group: 'animal' },
  { id: 'polar-bear-03', name: 'Polar Bear (03)', group: 'animal' },
  { id: 'polar-bear-04', name: 'Polar Bear (04)', group: 'animal' },
  { id: 'polar-bear-05', name: 'Polar Bear (05)', group: 'animal' },
  { id: 'rabbit-01', name: 'Rabbit (01)', group: 'animal' },
  { id: 'rabbit-02', name: 'Rabbit (02)', group: 'animal' },
  { id: 'rabbit-03', name: 'Rabbit (03)', group: 'animal' },
  { id: 'rabbit-04', name: 'Rabbit (04)', group: 'animal' },
  { id: 'rabbit-05', name: 'Rabbit (05)', group: 'animal' },
  { id: 'cat-01', name: 'Cat (01)', group: 'animal' },
  { id: 'cat-02', name: 'Cat (02)', group: 'animal' },
  { id: 'cat-03', name: 'Cat (03)', group: 'animal' },
  { id: 'cat-04', name: 'Cat (04)', group: 'animal' },
  { id: 'cat-05', name: 'Cat (05)', group: 'animal' },
  { id: 'fox-01', name: 'Fox (01)', group: 'animal' },
  { id: 'fox-02', name: 'Fox (02)', group: 'animal' },
  { id: 'fox-03', name: 'Fox (03)', group: 'animal' },
  { id: 'fox-04', name: 'Fox (04)', group: 'animal' },
  { id: 'fox-05', name: 'Fox (05)', group: 'animal' },
  { id: 'deer-01', name: 'Deer (01)', group: 'animal' },
  { id: 'deer-02', name: 'Deer (02)', group: 'animal' },
  { id: 'deer-03', name: 'Deer (03)', group: 'animal' },
  { id: 'deer-04', name: 'Deer (04)', group: 'animal' },
  { id: 'deer-05', name: 'Deer (05)', group: 'animal' }
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

type Variant = 1 | 2 | 3 | 4 | 5;

function PartyHatTop({ variant }: { variant: Variant }) {
  const hatColorClass =
    variant === 1
      ? 'text-winter-purple'
      : variant === 2
        ? 'text-winter-blue'
        : variant === 3
          ? 'text-pine'
          : variant === 4
            ? 'text-gold'
            : 'text-winter-purple';

  const pomColorClass = variant === 4 ? 'text-snow' : 'text-gold';

  return (
    <>
      <g className={hatColorClass} fill="currentColor" opacity="0.95">
        <path d="M32 6c-6.6 6.3-10.5 12.4-11.4 18.8 3.3-2 7.2-3.1 11.4-3.1s8.1 1.1 11.4 3.1C42.5 18.4 38.6 12.3 32 6z" />
      </g>
      <g className={pomColorClass} fill="currentColor" opacity="0.95">
        <circle cx="32" cy="7" r="2.2" />
      </g>
      {variant === 5 && (
        <g className="text-gold" fill="currentColor" opacity="0.9">
          <circle cx="22" cy="22" r="1.4" />
          <circle cx="44" cy="20" r="1.2" />
          <circle cx="42" cy="34" r="1.3" />
        </g>
      )}
    </>
  );
}

function Scarf({ variant }: { variant: Variant }) {
  const scarfColorClass = variant === 2 ? 'text-winter-purple' : variant === 3 ? 'text-winter-blue' : 'text-pine';
  return (
    <g className={scarfColorClass} fill="currentColor" opacity="0.9">
      <path d="M18 44h28l-3 6H21l-3-6z" />
      {variant >= 4 && <path d="M27 44l4 12" opacity="0.95" />}
    </g>
  );
}

function Confetti({ variant }: { variant: Variant }) {
  if (variant === 1) return null;
  return (
    <g className="text-gold" fill="currentColor" opacity="0.9">
      <circle cx="16" cy="22" r={variant === 2 ? 1.4 : 1.8} />
      <circle cx="50" cy="20" r={variant === 4 ? 1.8 : 1.4} />
      <circle cx="46" cy="46" r={variant === 3 ? 1.6 : 1.2} />
    </g>
  );
}

function Penguin({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Penguin" className={className}>
      <g className="text-midnight" fill="currentColor">
        <path d="M32 14c9 0 15 7.5 15 17.5S41 52 32 52 17 41.5 17 31.5 23 14 32 14z" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.96">
        <path d="M32 20c6 0 9.6 5.3 9.6 12.1S38 48 32 48s-9.6-9.1-9.6-15.9S26 20 32 20z" />
        <circle cx="26.7" cy="30" r="2" />
        <circle cx="37.3" cy="30" r="2" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.95">
        <path d="M32 32l5 3-5 3-5-3 5-3z" />
      </g>
      <PartyHatTop variant={variant} />
      {variant >= 3 && <Confetti variant={variant} />}
    </SvgBase>
  );
}

function PolarBear({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Polar Bear" className={className}>
      <g className="text-snow" fill="currentColor">
        <path d="M20 30c0-8 5.4-14 12-14s12 6 12 14-5.4 22-12 22-12-14-12-22z" />
        <circle cx="22" cy="20" r="4" />
        <circle cx="42" cy="20" r="4" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.75">
        <circle cx="28" cy="30" r="2" />
        <circle cx="36" cy="30" r="2" />
        <path d="M32 32c2.1 0 3.8 1.7 3.8 3.8 0 2.8-2.2 4.8-3.8 4.8s-3.8-2-3.8-4.8c0-2.1 1.7-3.8 3.8-3.8z" />
      </g>
      <PartyHatTop variant={variant} />
      {variant >= 2 && <Confetti variant={variant} />}
    </SvgBase>
  );
}

function Rabbit({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Rabbit" className={className}>
      <g className="text-snow" fill="currentColor">
        <path d="M18 32c0-8 6.3-14 14-14s14 6 14 14-6.3 20-14 20-14-12-14-20z" />
        <path d="M22 12c2 0 4 3 4 8 0 4-1.2 8-3 10-2-2-3-6-3-10 0-5 0-8 2-8z" />
        <path d="M42 12c2 0 2 3 2 8 0 4-1 8-3 10-1.8-2-3-6-3-10 0-5 2-8 4-8z" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.75">
        <circle cx="27" cy="32" r="2" />
        <circle cx="37" cy="32" r="2" />
      </g>
      <g className="text-gold" fill="currentColor" opacity="0.95">
        <path d="M32 34l2.8 2.2L32 38.6l-2.8-2.4L32 34z" />
      </g>
      {variant >= 2 && <PartyHatTop variant={variant} />}
      {variant >= 4 && <Confetti variant={variant} />}
    </SvgBase>
  );
}

function Cat({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Cat" className={className}>
      <g className="text-midnight" fill="currentColor">
        <path d="M16 30c0-7 6.5-13 16-13s16 6 16 13-6.5 22-16 22-16-15-16-22z" />
        <path d="M20 20l6-6v10" />
        <path d="M44 20l-6-6v10" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.92">
        <circle cx="27" cy="32" r="2" />
        <circle cx="37" cy="32" r="2" />
        <path
          d="M24 40c2.2 1.6 5 2.4 8 2.4s5.8-.8 8-2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
      {variant >= 2 && <PartyHatTop variant={variant} />}
      <Confetti variant={variant} />
    </SvgBase>
  );
}

function Fox({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Fox" className={className}>
      <g className="text-gold" fill="currentColor">
        <path d="M32 16c8 0 16 6 16 16S40 52 32 52 16 42 16 32s8-16 16-16z" />
        <path d="M18 24l6-8v12" />
        <path d="M46 24l-6-8v12" />
      </g>
      <g className="text-snow" fill="currentColor" opacity="0.92">
        <path d="M32 26c5.6 0 10.2 4 10.2 9 0 6-4.8 12-10.2 12S21.8 41 21.8 35c0-5 4.6-9 10.2-9z" />
        <circle cx="27" cy="32" r="2" />
        <circle cx="37" cy="32" r="2" />
      </g>
      {variant === 1 ? <PartyHatTop variant={variant} /> : <Scarf variant={variant} />}
      {variant >= 3 && <Confetti variant={variant} />}
    </SvgBase>
  );
}

function Deer({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <SvgBase title="Deer" className={className}>
      <g className="text-gold" fill="currentColor" opacity="0.95">
        <path d="M20 34c0-9 6.2-16 12-16s12 7 12 16-6.2 18-12 18-12-9-12-18z" />
      </g>
      <g className="text-pine" fill="currentColor" opacity="0.9">
        <path d="M18 18c4 0 6 3 6 6 0 2.2-1 4.2-2.6 5.6-1.2-1.3-2-3.2-2-5.6 0-2 0-6 .6-6z" />
        <path d="M46 18c-4 0-6 3-6 6 0 2.2 1 4.2 2.6 5.6 1.2-1.3 2-3.2 2-5.6 0-2 0-6-.6-6z" />
      </g>
      <g className="text-midnight" fill="currentColor" opacity="0.75">
        <circle cx="28" cy="34" r="2" />
        <circle cx="36" cy="34" r="2" />
        <path d="M32 36c2 0 3.6 1.6 3.6 3.6 0 2.6-2.1 4.4-3.6 4.4s-3.6-1.8-3.6-4.4c0-2 1.6-3.6 3.6-3.6z" />
      </g>
      {variant <= 2 ? <PartyHatTop variant={variant} /> : <Scarf variant={variant} />}
      {variant >= 4 && <Confetti variant={variant} />}
    </SvgBase>
  );
}

function makeVariantRenderer(
  base: (props: { className?: string; variant: Variant }) => React.ReactElement,
  variant: Variant
) {
  return ({ className }: { className?: string }) => base({ className, variant });
}

const Penguin01 = makeVariantRenderer(Penguin, 1);
const Penguin02 = makeVariantRenderer(Penguin, 2);
const Penguin03 = makeVariantRenderer(Penguin, 3);
const Penguin04 = makeVariantRenderer(Penguin, 4);
const Penguin05 = makeVariantRenderer(Penguin, 5);

const PolarBear01 = makeVariantRenderer(PolarBear, 1);
const PolarBear02 = makeVariantRenderer(PolarBear, 2);
const PolarBear03 = makeVariantRenderer(PolarBear, 3);
const PolarBear04 = makeVariantRenderer(PolarBear, 4);
const PolarBear05 = makeVariantRenderer(PolarBear, 5);

const Rabbit01 = makeVariantRenderer(Rabbit, 1);
const Rabbit02 = makeVariantRenderer(Rabbit, 2);
const Rabbit03 = makeVariantRenderer(Rabbit, 3);
const Rabbit04 = makeVariantRenderer(Rabbit, 4);
const Rabbit05 = makeVariantRenderer(Rabbit, 5);

const Cat01 = makeVariantRenderer(Cat, 1);
const Cat02 = makeVariantRenderer(Cat, 2);
const Cat03 = makeVariantRenderer(Cat, 3);
const Cat04 = makeVariantRenderer(Cat, 4);
const Cat05 = makeVariantRenderer(Cat, 5);

const Fox01 = makeVariantRenderer(Fox, 1);
const Fox02 = makeVariantRenderer(Fox, 2);
const Fox03 = makeVariantRenderer(Fox, 3);
const Fox04 = makeVariantRenderer(Fox, 4);
const Fox05 = makeVariantRenderer(Fox, 5);

const Deer01 = makeVariantRenderer(Deer, 1);
const Deer02 = makeVariantRenderer(Deer, 2);
const Deer03 = makeVariantRenderer(Deer, 3);
const Deer04 = makeVariantRenderer(Deer, 4);
const Deer05 = makeVariantRenderer(Deer, 5);

const RENDERERS: Record<AvatarId, (props: { className?: string }) => React.ReactElement> = {
  'penguin-01': Penguin01,
  'penguin-02': Penguin02,
  'penguin-03': Penguin03,
  'penguin-04': Penguin04,
  'penguin-05': Penguin05,
  'polar-bear-01': PolarBear01,
  'polar-bear-02': PolarBear02,
  'polar-bear-03': PolarBear03,
  'polar-bear-04': PolarBear04,
  'polar-bear-05': PolarBear05,
  'rabbit-01': Rabbit01,
  'rabbit-02': Rabbit02,
  'rabbit-03': Rabbit03,
  'rabbit-04': Rabbit04,
  'rabbit-05': Rabbit05,
  'cat-01': Cat01,
  'cat-02': Cat02,
  'cat-03': Cat03,
  'cat-04': Cat04,
  'cat-05': Cat05,
  'fox-01': Fox01,
  'fox-02': Fox02,
  'fox-03': Fox03,
  'fox-04': Fox04,
  'fox-05': Fox05,
  'deer-01': Deer01,
  'deer-02': Deer02,
  'deer-03': Deer03,
  'deer-04': Deer04,
  'deer-05': Deer05
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
  const id: AvatarId = isAvatarId(String(avatarId ?? '')) ? (avatarId as AvatarId) : 'penguin-01';
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
