'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import SnowEffect from './components/SnowEffect';
import BurstOverlay, { useBurstOverlay } from './components/BurstOverlay';
import { playChime } from './lib/sound';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

function getCountdown(): Countdown {
  const target = new Date('2026-01-01T00:00:00');
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isComplete: false };
}

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function randomWish() {
  const wishes = [
    'Wishing you a bright, cozy, and magical 2026!',
    'May your 2026 sparkle with joy and kindness.',
    'New year, new memories—let’s make them beautiful.',
    'Cheers to warm hearts and fresh beginnings in 2026!',
    'May your days be merry, your nights be calm, and your dreams be big.'
  ];
  return wishes[Math.floor(Math.random() * wishes.length)];
}

export default function HomePage() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());
  const [soundOn, setSoundOn] = useState(false);
  const [wish, setWish] = useState<string>(() => randomWish());
  const [viewportWidth, setViewportWidth] = useState<number>(1200);
  const { particles, burst } = useBurstOverlay();

  const activitiesRef = useRef<HTMLDivElement | null>(null);
  const activitiesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { scrollY } = useScroll();
  const skyY = useTransform(scrollY, [0, 900], [0, 40]);
  const cloudsY = useTransform(scrollY, [0, 900], [0, 90]);
  const hillsY = useTransform(scrollY, [0, 900], [0, 160]);

  const runners = useMemo(
    () => [
      { emoji: '🎅', lane: 0, scale: 1.0, duration: 14, delay: 0.5 },
      { emoji: '🧝‍♂️', lane: 1, scale: 0.95, duration: 12, delay: 2.0 },
      { emoji: '👺', lane: 2, scale: 0.9, duration: 16, delay: 4.0 }
    ],
    []
  );

  const cards = useMemo(
    () => [
      {
        title: 'Write a Letter',
        description: 'Send a warm New Year message to someone you care about.',
        href: '/write',
        accent: 'from-gold to-gold-light'
      },
      {
        title: 'Open Inbox',
        description: 'Unwrap letters written just for you.',
        href: '/inbox',
        accent: 'from-pine-light to-pine'
      },
      {
        title: 'Share a Wish',
        description: 'Tap to generate a cheerful 2026 greeting.',
        href: null as string | null,
        accent: 'from-winter-purple to-gold'
      },
      {
        title: 'Snow Burst',
        description: 'Click for a little sparkle of winter magic.',
        href: null as string | null,
        accent: 'from-winter-blue to-winter-purple'
      }
    ],
    []
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('soundOn');
      if (saved === 'true') setSoundOn(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = activitiesRef.current;
    const canvas = activitiesCanvasRef.current;
    if (!root || !canvas) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getColorFromClass = (className: string, property: 'color' | 'backgroundColor') => {
      const el = document.createElement('span');
      el.className = `${className} fixed -left-[9999px] -top-[9999px]`;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el);
      const value = computed[property];
      document.body.removeChild(el);
      return value;
    };

    const colors = {
      snow: getColorFromClass('text-snow', 'color'),
      snowDark: getColorFromClass('text-snow-dark', 'color'),
      gold: getColorFromClass('text-gold', 'color'),
      pineLight: getColorFromClass('text-pine-light', 'color')
    };

    let dpr = 1;
    let w = 0;
    let h = 0;
    let last = performance.now();
    let raf = 0;
    let points: Array<{ x: number; y: number }> = [];

    const measure = () => {
      const rect = root.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-activity-tile]'));
      points = tiles
        .map((t) => {
          const r = t.getBoundingClientRect();
          const x = r.left - rect.left + r.width / 2;
          const y = r.top - rect.top + 46;
          return { x, y };
        })
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
    };

    const drawSnowEdge = () => {
      // Soft snow strip at the bottom of the Activities block
      const bandTop = h - 110;
      ctx.save();
      ctx.globalAlpha = 0.18;
      const g = ctx.createLinearGradient(0, bandTop, 0, h);
      g.addColorStop(0, 'rgba(255,255,255,0.00)');
      g.addColorStop(1, 'rgba(255,255,255,0.22)');
      ctx.fillStyle = g;
      ctx.fillRect(0, bandTop, w, 110);

      ctx.globalAlpha = 0.12;
      ctx.fillStyle = colors.snow;
      for (let i = 0; i < 10; i++) {
        const cx = (i / 9) * w;
        const rr = 120 + (i % 4) * 36;
        ctx.beginPath();
        ctx.arc(cx, h + 40, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawPath = (t: number) => {
      if (points.length < 2) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Base line
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = colors.snow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const mx = (p0.x + p1.x) / 2;
        ctx.quadraticCurveTo(mx, p0.y + 18, p1.x, p1.y);
      }
      ctx.stroke();

      // Glow line
      ctx.globalAlpha = 0.10;
      ctx.strokeStyle = colors.gold;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const mx = (p0.x + p1.x) / 2;
        ctx.quadraticCurveTo(mx, p0.y + 18, p1.x, p1.y);
      }
      ctx.stroke();

      // Nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + i * 1.7);
        ctx.globalAlpha = 0.22 + pulse * 0.18;
        ctx.fillStyle = i === 0 ? colors.pineLight : colors.gold;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.10 + pulse * 0.10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Traveler dot
      const seg = Math.max(1, points.length - 1);
      const progress = (t * 0.00008) % 1;
      const idx = Math.min(seg - 1, Math.floor(progress * seg));
      const localT = progress * seg - idx;
      const a = points[idx];
      const b = points[idx + 1];
      const x = a.x + (b.x - a.x) * localT;
      const y = a.y + (b.y - a.y) * localT;
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = colors.snow;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.18;
      ctx.fillStyle = colors.gold;
      ctx.beginPath();
      ctx.arc(x, y, 8.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawSparkles = (t: number) => {
      if (points.length === 0) return;
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = colors.snow;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        for (let s = 0; s < 4; s++) {
          const a = (t * 0.0009 + i * 1.2 + s * 0.9) % (Math.PI * 2);
          const rr = 18 + s * 10;
          const x = p.x + Math.cos(a) * rr;
          const y = p.y + Math.sin(a) * (rr * 0.55);
          const r = 1.2 + (s % 2) * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = now - last;
      last = now;
      // Light throttle when tab is backgrounded
      if (dt > 250) {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      drawSnowEdge();
      drawPath(now);
      drawSparkles(now);

      raf = requestAnimationFrame(render);
    };

    const onResize = () => {
      measure();
      if (prefersReducedMotion) {
        ctx.clearRect(0, 0, w, h);
        drawSnowEdge();
        drawPath(performance.now());
        return;
      }
    };

    measure();
    window.addEventListener('resize', onResize, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, w, h);
      drawSnowEdge();
      drawPath(performance.now());
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('soundOn', soundOn ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [soundOn]);

  useEffect(() => {
    const t = window.setInterval(() => setCountdown(getCountdown()), 250);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth || 1200);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const onCardClick = async (
    e: React.MouseEvent,
    opts: { kind?: 'confetti' | 'stars' | 'snow'; action?: 'wish' | 'snow' }
  ) => {
    const x = e.clientX;
    const y = e.clientY;

    burst({ x, y, kind: opts.kind ?? 'stars', count: 22 });
    playChime(soundOn);

    if (opts.action === 'wish') {
      const nextWish = randomWish();
      setWish(nextWish);
      try {
        await navigator.clipboard.writeText(nextWish);
      } catch {
        // ignore clipboard failures
      }
    }

    if (opts.action === 'snow') {
      burst({ x, y, kind: 'snow', count: 26 });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      <BurstOverlay particles={particles} />

      {/* Winter scene background (inspired vibe, original composition) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Clean sky gradients (no heavy blur) */}
        <motion.div style={{ y: skyY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-light/40 via-midnight/20 to-midnight-dark/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-winter-blue/10 via-winter-purple/10 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-snow/5 to-transparent" />
        </motion.div>

        {/* Stars (lightweight, crisp) */}
        <motion.div style={{ y: skyY }} className="absolute inset-0 opacity-80 motion-reduce:hidden">
          {Array.from({ length: 34 }).map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`absolute rounded-full bg-snow/70 ${i % 6 === 0 ? 'animate-pulse' : ''}`}
              style={{
                width: i % 7 === 0 ? 3 : 2,
                height: i % 7 === 0 ? 3 : 2,
                top: `${(i * 37) % 88}%`,
                left: `${(i * 53) % 96}%`,
                opacity: i % 9 === 0 ? 0.95 : 0.55,
                animationDelay: `${(i * 110) % 900}ms`
              }}
            />
          ))}
        </motion.div>

        {/* Floating clouds (drifting bands) */}
        <motion.div style={{ y: cloudsY }} className="absolute inset-0 motion-reduce:hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ x: [-60, 60, -60] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-24 left-10 h-16 w-44 rounded-full bg-snow/5 border border-white/5" />
            <div className="absolute top-40 left-44 h-14 w-36 rounded-full bg-snow/5 border border-white/5" />
            <div className="absolute top-28 right-16 h-16 w-48 rounded-full bg-snow/5 border border-white/5" />
            <div className="absolute top-52 right-52 h-14 w-36 rounded-full bg-snow/5 border border-white/5" />
          </motion.div>

          <motion.div
            className="absolute inset-0 opacity-70"
            animate={{ x: [80, -80, 80] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-36 left-24 h-12 w-40 rounded-full bg-snow/5 border border-white/5" />
            <div className="absolute top-60 left-80 h-10 w-28 rounded-full bg-snow/5 border border-white/5" />
            <div className="absolute top-44 right-28 h-12 w-44 rounded-full bg-snow/5 border border-white/5" />
          </motion.div>
        </motion.div>

        {/* Occasional shooting stars */}
        <motion.div style={{ y: skyY }} className="absolute inset-0 motion-reduce:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="absolute"
              style={{
                top: `${14 + i * 12}%`,
                left: `${10 + i * 22}%`,
                transform: 'rotate(-18deg)'
              }}
              animate={{ opacity: [0, 0, 1, 0], x: [0, 0, 220, 260] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 4 + i * 6
              }}
            >
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-snow/40 to-transparent" />
              <div className="mt-[-2px] h-1.5 w-1.5 rounded-full bg-snow/40" />
            </motion.div>
          ))}
        </motion.div>

        {/* Ornaments */}
        <motion.div style={{ y: cloudsY }} className="absolute -top-10 left-0 right-0 h-44">
          <div className="absolute left-[10%] top-0 h-40 w-px bg-white/10" />
          <motion.div
            className="absolute left-[10%] top-32 h-7 w-7 rounded-full bg-winter-purple/50 shadow-sm"
            animate={{ y: [0, 6, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="absolute left-[38%] top-0 h-44 w-px bg-white/10" />
          <motion.div
            className="absolute left-[38%] top-36 h-8 w-8 rounded-full bg-gold/60 shadow-sm"
            animate={{ y: [0, 8, 0], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="absolute left-[72%] top-0 h-36 w-px bg-white/10" />
          <motion.div
            className="absolute left-[72%] top-28 h-7 w-7 rounded-full bg-pine-light/50 shadow-sm"
            animate={{ y: [0, 7, 0], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Hills / snow ground */}
        <motion.div style={{ y: hillsY }} className="absolute -bottom-24 left-0 right-0">
          <div className="absolute left-1/2 -translate-x-1/2 h-64 w-[140%] rounded-[999px] bg-pine/20" />
          <div className="absolute left-1/2 -translate-x-1/2 top-16 h-72 w-[160%] rounded-[999px] bg-midnight-dark/70" />
          <div className="absolute left-1/2 -translate-x-1/2 top-12 h-56 w-[150%] rounded-[999px] bg-midnight/40" />
          <div className="absolute left-0 right-0 top-36 h-64 bg-gradient-to-t from-midnight-dark to-transparent" />

          {/* Snow rim line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-14 h-px w-[160%] bg-snow/10" />

          {/* Simple tree silhouettes */}
          <div className="absolute left-[12%] top-14 h-0 w-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[54px] border-b-pine/30" />
          <div className="absolute left-[10%] top-60 h-6 w-3 rounded bg-pine/30" />

          <div className="absolute left-[22%] top-18 h-0 w-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[40px] border-b-pine/25" />
          <div className="absolute left-[21.5%] top-56 h-5 w-2.5 rounded bg-pine/25" />

          <div className="absolute right-[16%] top-16 h-0 w-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[48px] border-b-pine/25" />
          <div className="absolute right-[16.7%] top-58 h-5 w-3 rounded bg-pine/25" />
        </motion.div>

        {/* Village silhouettes + flicker windows */}
        <div className="absolute left-0 right-0 bottom-[160px] h-28 opacity-80">
          <div className="absolute left-1/2 -translate-x-1/2 top-8 h-px w-[140%] bg-white/10" />

          {Array.from({ length: 12 }).map((_, i) => {
            const w = 58 + (i % 4) * 18;
            const h = 34 + ((i * 7) % 18);
            const left = `${(i * 9) % 100}%`;
            const base = i % 3 === 0 ? 'bg-midnight-dark/70' : i % 3 === 1 ? 'bg-midnight/60' : 'bg-midnight-light/50';

            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="absolute"
                style={{ left, bottom: 0, width: w, height: h }}
              >
                <div className={`absolute inset-0 rounded-md ${base} border border-white/10`} />
                {/* Roof */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-5 h-0 w-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[20px] border-b-midnight/70" />

                {/* Windows */}
                {Array.from({ length: 3 }).map((__, wi) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={wi}
                    className="absolute rounded-sm bg-gold/30 shadow-[0_0_14px_rgba(0,0,0,0.0)]"
                    style={{
                      width: 10,
                      height: 10,
                      left: 10 + wi * 16,
                      top: 10,
                      opacity: 0.25 + ((i + wi) % 4) * 0.15,
                      animation: 'pulse 2.6s ease-in-out infinite',
                      animationDelay: `${(i * 210 + wi * 340) % 1200}ms`
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Snowy ground band (crisp, visible) */}
        <div className="absolute left-0 right-0 bottom-0 h-[220px]">
          <div className="absolute inset-0 bg-gradient-to-t from-snow/25 via-snow/10 to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 h-[170px] bg-gradient-to-t from-snow/35 to-transparent" />
          {/* Soft edge using circles */}
          <div className="absolute left-0 right-0 bottom-[120px] h-24 opacity-70">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="absolute rounded-full bg-snow/15"
                style={{
                  width: 120 + (i % 5) * 34,
                  height: 120 + (i % 5) * 34,
                  left: `${i * 8}%`,
                  bottom: -40 - (i % 3) * 10
                }}
              />
            ))}
          </div>
        </div>

        {/* Running characters (big, obvious animation) */}
        <div className="absolute left-0 right-0 bottom-[76px] h-24 motion-reduce:hidden">
          {runners.map((r) => (
            <motion.div
              key={r.emoji}
              className="absolute left-0"
              style={{
                bottom: r.lane * 8,
                fontSize: `${28 * r.scale}px`,
                filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35))'
              }}
              initial={{ x: -80 }}
              animate={{ x: viewportWidth + 120 }}
              transition={{
                duration: r.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: r.delay
              }}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
              >
                {r.emoji}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <header className="relative z-10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-4 py-2 glass-effect hover:scale-[1.02] transition-transform"
            onClick={(e) => onCardClick(e, { kind: 'stars' })}
          >
            <span className="text-2xl">🎁</span>
            <span className="font-sans font-semibold text-snow">New Year 2026</span>
          </Link>

          <button
            type="button"
            onClick={(e) => {
              setSoundOn((v) => !v);
              onCardClick(e, { kind: 'confetti' });
            }}
            className="glass-effect rounded-full px-4 py-2 flex items-center gap-3 hover:scale-[1.02] transition-transform"
            aria-pressed={soundOn}
          >
            <span className="text-snow-dark text-sm">Sound</span>
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundOn ? 'bg-pine-light/80' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-snow shadow-sm transition-transform ${
                  soundOn ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </span>
            <span className="text-snow-dark text-sm">{soundOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-10 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 glass-effect mb-6">
                <span className="text-gold">✨</span>
                <span className="text-snow-dark text-sm">Scene • Activities • Letters • Sparkle</span>
              </div>

              <h1 className="font-sans text-5xl sm:text-6xl font-extrabold tracking-tight text-snow">
                Happy New Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">2026</span>
              </h1>
              <p className="mt-5 text-lg text-snow-dark max-w-xl">
                A playful winter world—watch the countdown, tap for sparkle, and send warm New Year letters.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="rounded-2xl px-6 py-3 font-semibold text-midnight bg-gradient-to-r from-gold to-gold-light hover:shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={(e) => onCardClick(e, { kind: 'confetti' })}
                >
                  Start the Fun
                </Link>
                <Link
                  href="#activities"
                  className="rounded-2xl px-6 py-3 font-semibold text-snow glass-effect hover:shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={(e) => onCardClick(e, { kind: 'stars' })}
                >
                  Explore Activities
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 glass-effect text-snow-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold/80" />
                  Tap anywhere for sparkles
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 glass-effect text-snow-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-pine-light/70" />
                  Sound is optional (default off)
                </span>
              </div>
            </motion.div>

            {/* Animated illustration (flat + soft 3D feel) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute inset-0 rounded-[2rem] winter-gradient opacity-60" />
                <div className="relative rounded-[2rem] glass-effect p-8 letter-shadow overflow-hidden">
                  {/* Soft 3D-ish bubbles */}
                  <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gold/10" />
                  <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-winter-blue/10" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-winter-purple/60" />
                      <div className="h-3 w-3 rounded-full bg-gold/70" />
                      <div className="h-3 w-3 rounded-full bg-pine-light/60" />
                    </div>
                    <div className="text-xs text-snow-dark">Winter Console</div>
                  </div>

                  <motion.div
                    className="rounded-3xl bg-gradient-to-br from-midnight-light/80 via-midnight/40 to-midnight-dark/60 p-6 border border-white/10"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-snow-dark">Countdown to 2026</div>
                        <div className="mt-1 text-2xl font-sans font-bold text-snow">
                          {countdown.isComplete ? 'Happy New Year!' : 'Almost there…'}
                        </div>
                      </div>
                      <div className="text-4xl">🎆</div>
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-3">
                      {[
                        { label: 'Days', value: countdown.days },
                        { label: 'Hours', value: countdown.hours },
                        { label: 'Min', value: countdown.minutes },
                        { label: 'Sec', value: countdown.seconds }
                      ].map((b) => (
                        <div key={b.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
                          <div className="text-2xl font-sans font-extrabold text-snow">{pad2(b.value)}</div>
                          <div className="text-xs text-snow-dark mt-1">{b.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="mt-6 rounded-3xl bg-white/5 border border-white/10 p-5">
                    <div className="text-xs text-snow-dark">Today’s wish</div>
                    <div className="mt-2 text-snow font-sans font-semibold">{wish}</div>
                    <div className="mt-3 text-xs text-snow-dark">Tip: tap “Share a Wish” to copy.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Activities */}
        <section id="activities" className="container mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-snow">Activities</h2>
            <p className="mt-2 text-snow-dark max-w-2xl">Pick a tile—each one is a tiny winter moment.</p>
          </motion.div>

          <div ref={activitiesRef} className="relative">
            <canvas
              ref={activitiesCanvasRef}
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden="true"
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c, idx) => {
              const icon =
                c.title === 'Write a Letter'
                  ? '✍️'
                  : c.title === 'Open Inbox'
                    ? '📬'
                    : c.title === 'Share a Wish'
                      ? '🎉'
                      : '❄️';

              const content = (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full"
                >
                  <div
                    className="h-full glass-effect rounded-3xl p-5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${c.accent} shadow-sm flex items-center justify-center text-xl`}>
                        {icon}
                      </div>
                      <div className="h-8 w-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-snow/80 group-hover:bg-white/10 transition-colors">
                        ✨
                      </div>
                    </div>
                    <div className="font-sans font-bold text-snow text-lg">{c.title}</div>
                    <div className="mt-2 text-sm text-snow-dark">{c.description}</div>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-snow">
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">Open</span>
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  </div>
                </motion.div>
              );

              if (c.href) {
                return (
                  <Link
                    key={c.title}
                    href={c.href}
                    onClick={(e) => onCardClick(e, { kind: 'stars' })}
                    className="block"
                    data-activity-tile
                  >
                    {content}
                  </Link>
                );
              }

              const action = c.title === 'Share a Wish' ? 'wish' : 'snow';
              const kind = c.title === 'Share a Wish' ? 'confetti' : 'snow';
              return (
                <button
                  key={c.title}
                  type="button"
                  className="text-left"
                  onClick={(e) => onCardClick(e, { kind, action })}
                  data-activity-tile
                >
                  {content}
                </button>
              );
            })}
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-snow-dark">
            Sound is off by default. Toggle it when you want extra sparkle.
          </div>
        </section>
      </main>

      <footer className="relative z-10 pb-10">
        <div className="container mx-auto px-6 text-center text-xs text-snow-dark">
          Made for everyone—kids, grown-ups, and the young at heart.
        </div>
      </footer>
    </div>
  );
}
