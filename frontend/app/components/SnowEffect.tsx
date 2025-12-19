'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute w-1 h-1 bg-snow rounded-full opacity-60"
          style={{ left: `${flake.left}%` }}
          initial={{ y: -10, opacity: 0 }}
          animate={{
            y: '100vh',
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
