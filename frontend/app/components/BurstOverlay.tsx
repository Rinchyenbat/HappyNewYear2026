'use client';

import { useEffect, useMemo, useState } from 'react';

type BurstKind = 'confetti' | 'stars' | 'snow';

type Particle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  rotate: number;
  vrot: number;
  kind: BurstKind;
  colorClass: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function useBurstOverlay() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = (opts: { x: number; y: number; kind?: BurstKind; count?: number }) => {
    const kind = opts.kind ?? 'confetti';
    const count = opts.count ?? 20;

    const created: Particle[] = Array.from({ length: count }).map(() => {
      const angle = rand(-Math.PI * 0.9, -Math.PI * 0.1);
      const speed = rand(180, 520);

      const colorClass =
        kind === 'snow'
          ? 'bg-snow'
          : kind === 'stars'
            ? 'bg-gold'
            : Math.random() > 0.5
              ? 'bg-red-500'
              : 'bg-pine-light';

      return {
        id: uid(),
        x: opts.x,
        y: opts.y,
        vx: Math.cos(angle) * speed + rand(-60, 60),
        vy: Math.sin(angle) * speed,
        life: 0,
        ttl: rand(550, 950),
        size: kind === 'stars' ? rand(6, 10) : kind === 'snow' ? rand(4, 8) : rand(5, 9),
        rotate: rand(0, 360),
        vrot: rand(-420, 420),
        kind,
        colorClass
      };
    });

    setParticles((p) => [...p, ...created]);
  };

  useEffect(() => {
    if (particles.length === 0) return;

    let raf = 0;
    let last = performance.now();

    const step = (t: number) => {
      const dt = Math.min(32, t - last);
      last = t;

      setParticles((prev) => {
        const next = prev
          .map((p) => {
            const life = p.life + dt;
            const k = dt / 1000;

            const gravity = p.kind === 'snow' ? 220 : 980;
            const drag = p.kind === 'snow' ? 0.92 : 0.88;

            const vx = p.vx * drag;
            const vy = p.vy * drag + gravity * k;

            return {
              ...p,
              life,
              x: p.x + vx * k,
              y: p.y + vy * k,
              vx,
              vy,
              rotate: p.rotate + p.vrot * k
            };
          })
          .filter((p) => p.life < p.ttl);

        return next;
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [particles.length]);

  return { particles, burst } as const;
}

export default function BurstOverlay({ particles }: { particles: Particle[] }) {
  const styleBase = useMemo(
    () => ({ position: 'fixed' as const, inset: 0, pointerEvents: 'none' as const, zIndex: 60 }),
    []
  );

  return (
    <div style={styleBase} aria-hidden="true">
      {particles.map((p) => {
        const alpha = 1 - p.life / p.ttl;
        const isRound = p.kind !== 'confetti';

        return (
          <div
            key={p.id}
            className={`${p.colorClass} ${isRound ? 'rounded-full' : 'rounded-sm'} shadow-sm`}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              opacity: Math.max(0, Math.min(1, alpha)),
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`
            }}
          />
        );
      })}
    </div>
  );
}
