'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

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
  const { particles, burst } = useBurstOverlay();

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
        accent: 'from-red-500 to-gold'
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

      {/* Parallax-ish background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-winter-purple/10 blur-3xl" />
        <div className="absolute top-32 -right-28 h-96 w-96 rounded-full bg-winter-blue/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-midnight-dark/80 to-transparent" />
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
                <span className="text-snow-dark text-sm">Magical • Joyful • Friendly • Celebratory</span>
              </div>

              <h1 className="font-sans text-5xl sm:text-6xl font-extrabold tracking-tight text-snow">
                Happy New Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">2026</span>
              </h1>
              <p className="mt-5 text-lg text-snow-dark max-w-xl">
                A playful winter playground inspired by Santa Tracker—count down, click for sparkle, and send warm letters.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="rounded-xl px-6 py-3 font-semibold text-midnight bg-gradient-to-r from-gold to-gold-light hover:shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={(e) => onCardClick(e, { kind: 'confetti' })}
                >
                  Start the Fun
                </Link>
                <Link
                  href="#activities"
                  className="rounded-xl px-6 py-3 font-semibold text-snow glass-effect hover:shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={(e) => onCardClick(e, { kind: 'stars' })}
                >
                  Explore Activities
                </Link>
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
                <div className="absolute inset-0 rounded-[2rem] winter-gradient blur-xl opacity-60" />
                <div className="relative rounded-[2rem] glass-effect p-8 letter-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-gold/80" />
                      <div className="h-3 w-3 rounded-full bg-pine-light/80" />
                    </div>
                    <div className="text-xs text-snow-dark">Winter Mode</div>
                  </div>

                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-midnight-light/80 via-midnight/40 to-midnight-dark/60 p-6 border border-white/10"
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
                        <div key={b.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                          <div className="text-2xl font-sans font-extrabold text-snow">{pad2(b.value)}</div>
                          <div className="text-xs text-snow-dark mt-1">{b.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
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
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-snow">Playful activities</h2>
            <p className="mt-2 text-snow-dark max-w-2xl">
              Hover, tap, and explore—every card has a little winter magic.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c, idx) => {
              const content = (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full"
                >
                  <div
                    className="h-full glass-effect rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c.accent} mb-4 shadow-sm`} />
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
                >
                  {content}
                </button>
              );
            })}
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
