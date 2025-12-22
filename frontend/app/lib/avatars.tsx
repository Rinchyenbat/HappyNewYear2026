import React from 'react';

export type AvatarId =
  | 'penguin'
  | 'polar-bear'
  | 'rabbit'
  | 'cat'
  | 'fox'
  | 'deer'
  | 'owl'
  | 'seal'
  | 'wolf'
  | 'dog'
  | 'panda'
  | 'koala'
  | 'tiger'
  | 'lion'
  | 'elephant'
  | 'giraffe'
  | 'zebra'
  | 'monkey'
  | 'raccoon'
  | 'squirrel'
  | 'hedgehog'
  | 'otter'
  | 'dolphin'
  | 'whale'
  | 'crocodile'
  | 'frog'
  | 'turtle'
  | 'chick'
  | 'cow'
  | 'horse';

export type AvatarSpec = {
  id: AvatarId;
  name: string;
};

export const AVATARS: AvatarSpec[] = [
  { id: 'penguin', name: 'Penguin' },
  { id: 'polar-bear', name: 'Polar Bear' },
  { id: 'rabbit', name: 'Rabbit' },
  { id: 'cat', name: 'Cat' },
  { id: 'fox', name: 'Fox' },
  { id: 'deer', name: 'Deer' },
  { id: 'owl', name: 'Owl' },
  { id: 'seal', name: 'Seal' },
  { id: 'wolf', name: 'Wolf' },
  { id: 'dog', name: 'Dog' },
  { id: 'panda', name: 'Panda' },
  { id: 'koala', name: 'Koala' },
  { id: 'tiger', name: 'Tiger' },
  { id: 'lion', name: 'Lion' },
  { id: 'elephant', name: 'Elephant' },
  { id: 'giraffe', name: 'Giraffe' },
  { id: 'zebra', name: 'Zebra' },
  { id: 'monkey', name: 'Monkey' },
  { id: 'raccoon', name: 'Raccoon' },
  { id: 'squirrel', name: 'Squirrel' },
  { id: 'hedgehog', name: 'Hedgehog' },
  { id: 'otter', name: 'Otter' },
  { id: 'dolphin', name: 'Dolphin' },
  { id: 'whale', name: 'Whale' },
  { id: 'crocodile', name: 'Crocodile' },
  { id: 'frog', name: 'Frog' },
  { id: 'turtle', name: 'Turtle' },
  { id: 'chick', name: 'Chick' },
  { id: 'cow', name: 'Cow' },
  { id: 'horse', name: 'Horse' }
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

function Eyes() {
  return (
    <g className="text-midnight" fill="currentColor" opacity="0.85">
      <circle cx="26" cy="30" r="2" />
      <circle cx="38" cy="30" r="2" />
    </g>
  );
}

function Sparkle() {
  return (
    <g className="text-gold" fill="currentColor" opacity="0.9">
      <circle cx="50" cy="18" r="1.4" />
      <circle cx="46" cy="48" r="1.2" />
      <circle cx="16" cy="22" r="1.2" />
    </g>
  );
}

function AnimalHead({
  title,
  className,
  headClass,
  ears,
  face,
  extra
}: {
  title: string;
  className?: string;
  headClass: string;
  ears?: React.ReactNode;
  face?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <SvgBase title={title} className={className}>
      {ears}
      <g className={headClass} fill="currentColor">
        <path d="M32 14c12 0 22 9.5 22 21.2C54 47 44 54 32 54S10 47 10 35.2C10 23.5 20 14 32 14z" />
      </g>
      <Eyes />
      {face}
      {extra}
    </SvgBase>
  );
}

const RENDERERS: Record<AvatarId, (props: { className?: string }) => React.ReactElement> = {
  penguin: ({ className }) => (
    <AnimalHead
      title="Penguin"
      className={className}
      headClass="text-midnight"
      face={
        <>
          <g className="text-snow" fill="currentColor" opacity="0.95">
            <path d="M32 22c7 0 12 6.5 12 14.2S39 50 32 50s-12-6.1-12-13.8S25 22 32 22z" />
          </g>
          <g className="text-gold" fill="currentColor" opacity="0.95">
            <path d="M32 34l5 3-5 3-5-3 5-3z" />
          </g>
        </>
      }
      extra={<Sparkle />}
    />
  ),
  'polar-bear': ({ className }) => (
    <AnimalHead
      title="Polar Bear"
      className={className}
      headClass="text-snow"
      ears={
        <g className="text-snow" fill="currentColor">
          <circle cx="18" cy="20" r="5" />
          <circle cx="46" cy="20" r="5" />
        </g>
      }
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.75">
          <path d="M32 34c3 0 5.5 2.4 5.5 5.4 0 4-3.1 6.6-5.5 6.6s-5.5-2.6-5.5-6.6c0-3 2.5-5.4 5.5-5.4z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  rabbit: ({ className }) => (
    <AnimalHead
      title="Rabbit"
      className={className}
      headClass="text-snow"
      ears={
        <g className="text-snow" fill="currentColor">
          <path d="M20 12c4 0 7 6 7 12 0 4-1.4 7.6-3.2 10C20.8 30.8 18 26 18 22c0-6 0-10 2-10z" />
          <path d="M44 12c4 0 2 4 2 10 0 4-2.8 8.8-5.8 12-1.8-2.4-3.2-6-3.2-10 0-6 3-12 7-12z" />
        </g>
      }
      face={
        <g className="text-gold" fill="currentColor" opacity="0.9">
          <path d="M32 36l2.6 2L32 40.8l-2.6-2.2L32 36z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  cat: ({ className }) => (
    <AnimalHead
      title="Cat"
      className={className}
      headClass="text-midnight"
      ears={
        <g className="text-midnight" fill="currentColor">
          <path d="M18 24l7-10v14" />
          <path d="M46 24l-7-10v14" />
        </g>
      }
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M22 40c3 2.2 6.4 3.2 10 3.2S39 42.2 42 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  fox: ({ className }) => (
    <AnimalHead
      title="Fox"
      className={className}
      headClass="text-gold"
      ears={
        <g className="text-gold" fill="currentColor">
          <path d="M18 26l6-10v14" />
          <path d="M46 26l-6-10v14" />
        </g>
      }
      face={
        <g className="text-snow" fill="currentColor" opacity="0.92">
          <path d="M32 26c7 0 12 5 12 11.2C44 44 38.6 49 32 49s-12-5-12-11.8C20 31 25 26 32 26z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  deer: ({ className }) => (
    <AnimalHead
      title="Deer"
      className={className}
      headClass="text-gold"
      ears={
        <g className="text-pine" fill="currentColor" opacity="0.9">
          <path d="M16 18c6 0 10 6 10 10 0 3-1.4 5.2-3.4 7-2.4-3.2-4-6.4-4-9 0-2 0-8 1.4-8z" />
          <path d="M48 18c-6 0-10 6-10 10 0 3 1.4 5.2 3.4 7 2.4-3.2 4-6.4 4-9 0-2 0-8-1.4-8z" />
        </g>
      }
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.75">
          <path d="M32 36c2.4 0 4.4 2 4.4 4.4 0 3.2-2.5 5.4-4.4 5.4s-4.4-2.2-4.4-5.4c0-2.4 2-4.4 4.4-4.4z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),

  owl: ({ className }) => (
    <AnimalHead
      title="Owl"
      className={className}
      headClass="text-winter-purple"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.92">
          <circle cx="24" cy="30" r="7" />
          <circle cx="40" cy="30" r="7" />
          <path d="M32 34l3 2-3 3-3-3 3-2z" className="text-gold" fill="currentColor" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  seal: ({ className }) => (
    <AnimalHead
      title="Seal"
      className={className}
      headClass="text-winter-blue"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M32 34c4.5 0 8 2.8 8 6.4 0 4.8-3.6 7.6-8 7.6s-8-2.8-8-7.6c0-3.6 3.5-6.4 8-6.4z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  wolf: ({ className }) => (
    <AnimalHead
      title="Wolf"
      className={className}
      headClass="text-midnight-light"
      ears={
        <g className="text-midnight-light" fill="currentColor">
          <path d="M18 28l6-12v14" />
          <path d="M46 28l-6-12v14" />
        </g>
      }
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M32 28c6 0 10 4.2 10 9.2 0 6-4.5 10-10 10s-10-4-10-10c0-5 4-9.2 10-9.2z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  dog: ({ className }) => (
    <AnimalHead
      title="Dog"
      className={className}
      headClass="text-pine"
      ears={
        <g className="text-pine" fill="currentColor" opacity="0.9">
          <path d="M14 30c0-7 6-12 11-12-1.6 4-2.2 7.8-1.8 12.2C19.2 31.8 16.3 32 14 30z" />
          <path d="M50 30c0-7-6-12-11-12 1.6 4 2.2 7.8 1.8 12.2 4 1.6 6.9 1.8 9.2-.2z" />
        </g>
      }
      face={<Sparkle />}
    />
  ),

  panda: ({ className }) => (
    <AnimalHead
      title="Panda"
      className={className}
      headClass="text-snow"
      ears={
        <g className="text-midnight" fill="currentColor">
          <circle cx="18" cy="20" r="5" />
          <circle cx="46" cy="20" r="5" />
          <circle cx="24" cy="30" r="6" opacity="0.45" />
          <circle cx="40" cy="30" r="6" opacity="0.45" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  koala: ({ className }) => (
    <AnimalHead
      title="Koala"
      className={className}
      headClass="text-snow-dark"
      ears={
        <g className="text-snow-dark" fill="currentColor" opacity="0.8">
          <circle cx="18" cy="22" r="7" />
          <circle cx="46" cy="22" r="7" />
        </g>
      }
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.8">
          <path d="M32 34c2.4 0 4.2 1.9 4.2 4.2 0 3.6-2.2 6-4.2 6s-4.2-2.4-4.2-6c0-2.3 1.9-4.2 4.2-4.2z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  tiger: ({ className }) => (
    <AnimalHead
      title="Tiger"
      className={className}
      headClass="text-gold"
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.55">
          <path d="M22 24l4 4-4 4-2-2 2-2-2-2 2-2z" />
          <path d="M42 24l-4 4 4 4 2-2-2-2 2-2-2-2z" />
          <path d="M32 22l2 4-2 4-2-4 2-4z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  lion: ({ className }) => (
    <AnimalHead
      title="Lion"
      className={className}
      headClass="text-gold"
      ears={
        <g className="text-gold" fill="currentColor" opacity="0.5">
          <circle cx="32" cy="34" r="24" />
        </g>
      }
      face={<Sparkle />}
    />
  ),
  elephant: ({ className }) => (
    <AnimalHead
      title="Elephant"
      className={className}
      headClass="text-snow-dark"
      face={
        <g className="text-snow-dark" fill="currentColor" opacity="0.95">
          <path d="M32 34c-3 0-6 2.4-6 6.2 0 6 3.4 12 6 12s6-6 6-12c0-3.8-3-6.2-6-6.2z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  giraffe: ({ className }) => (
    <AnimalHead
      title="Giraffe"
      className={className}
      headClass="text-gold"
      face={
        <g className="text-pine" fill="currentColor" opacity="0.5">
          <circle cx="24" cy="24" r="3" />
          <circle cx="40" cy="26" r="3" />
          <circle cx="34" cy="40" r="3" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  zebra: ({ className }) => (
    <AnimalHead
      title="Zebra"
      className={className}
      headClass="text-snow"
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.55">
          <path d="M22 22l4 8-4 8" />
          <path d="M30 20l2 10-2 10" />
          <path d="M38 22l-4 8 4 8" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  monkey: ({ className }) => (
    <AnimalHead
      title="Monkey"
      className={className}
      headClass="text-pine"
      ears={
        <g className="text-pine" fill="currentColor" opacity="0.8">
          <circle cx="16" cy="30" r="7" />
          <circle cx="48" cy="30" r="7" />
        </g>
      }
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M32 32c6 0 10 3.5 10 7.6S38 48 32 48s-10-4.3-10-8.4S26 32 32 32z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),

  raccoon: ({ className }) => (
    <AnimalHead
      title="Raccoon"
      className={className}
      headClass="text-snow-dark"
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.45">
          <path d="M18 30c3-6 10-10 14-10s11 4 14 10c-3 4-9 6-14 6s-11-2-14-6z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  squirrel: ({ className }) => (
    <AnimalHead
      title="Squirrel"
      className={className}
      headClass="text-pine"
      face={
        <g className="text-gold" fill="currentColor" opacity="0.9">
          <circle cx="32" cy="40" r="4" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  hedgehog: ({ className }) => (
    <AnimalHead
      title="Hedgehog"
      className={className}
      headClass="text-snow"
      ears={
        <g className="text-pine" fill="currentColor" opacity="0.85">
          <path d="M12 34c2-10 10-18 20-20-5 6-7 14-7 22-6 2-10 2-13-2z" />
          <path d="M52 34c-2-10-10-18-20-20 5 6 7 14 7 22 6 2 10 2 13-2z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  otter: ({ className }) => (
    <AnimalHead
      title="Otter"
      className={className}
      headClass="text-winter-blue"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M32 34c6 0 10 3.5 10 7.6S38 50 32 50s-10-4.6-10-8.8S26 34 32 34z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  dolphin: ({ className }) => (
    <AnimalHead
      title="Dolphin"
      className={className}
      headClass="text-winter-blue"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M22 40c3 3 6.5 4.5 10 4.5s7-1.5 10-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  whale: ({ className }) => (
    <AnimalHead
      title="Whale"
      className={className}
      headClass="text-midnight"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <circle cx="32" cy="44" r="6" />
        </g>
      }
      extra={
        <>
          <Sparkle />
          <g className="text-snow" fill="currentColor" opacity="0.9">
            <circle cx="46" cy="12" r="1.4" />
            <circle cx="48" cy="9" r="1" />
          </g>
        </>
      }
    />
  ),

  crocodile: ({ className }) => (
    <AnimalHead
      title="Crocodile"
      className={className}
      headClass="text-pine"
      face={
        <g className="text-snow" fill="currentColor" opacity="0.9">
          <path d="M22 40h20l-2 4H24l-2-4z" />
          <path d="M26 40l2 4" className="text-midnight" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M38 40l-2 4" className="text-midnight" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  frog: ({ className }) => (
    <AnimalHead
      title="Frog"
      className={className}
      headClass="text-pine"
      ears={
        <g className="text-pine" fill="currentColor">
          <circle cx="20" cy="22" r="6" />
          <circle cx="44" cy="22" r="6" />
        </g>
      }
      face={<Sparkle />}
    />
  ),
  turtle: ({ className }) => (
    <AnimalHead
      title="Turtle"
      className={className}
      headClass="text-winter-blue"
      face={
        <g className="text-pine" fill="currentColor" opacity="0.55">
          <path d="M22 26c6-4 14-4 20 0-4 8-16 8-20 0z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  chick: ({ className }) => (
    <AnimalHead
      title="Chick"
      className={className}
      headClass="text-gold"
      face={
        <g className="text-pine" fill="currentColor" opacity="0.9">
          <path d="M32 34l3 2-3 3-3-3 3-2z" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  cow: ({ className }) => (
    <AnimalHead
      title="Cow"
      className={className}
      headClass="text-snow"
      ears={
        <g className="text-midnight" fill="currentColor" opacity="0.5">
          <path d="M18 24c4 0 7 3 7 7-3 2-7 2-11 0 0-4 2-7 4-7z" />
          <path d="M46 24c-4 0-7 3-7 7 3 2 7 2 11 0 0-4-2-7-4-7z" />
          <circle cx="24" cy="24" r="3" />
          <circle cx="42" cy="28" r="3" />
        </g>
      }
      extra={<Sparkle />}
    />
  ),
  horse: ({ className }) => (
    <AnimalHead
      title="Horse"
      className={className}
      headClass="text-gold"
      face={
        <g className="text-midnight" fill="currentColor" opacity="0.55">
          <path d="M26 20c2 4 4 6 6 7-4 2-7 4-8 7-2-4-2-8 2-14z" />
          <path d="M38 20c-2 4-4 6-6 7 4 2 7 4 8 7 2-4 2-8-2-14z" />
        </g>
      }
      extra={<Sparkle />}
    />
  )
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
  const id: AvatarId = isAvatarId(String(avatarId ?? '')) ? (avatarId as AvatarId) : 'penguin';
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
