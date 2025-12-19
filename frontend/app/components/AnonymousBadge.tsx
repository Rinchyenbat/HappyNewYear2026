'use client';

import { motion } from 'framer-motion';

export default function AnonymousBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-winter-purple/20 border border-winter-purple/30 text-xs text-winter-purple font-medium"
    >
      <span className="text-sm">🎭</span>
      Anonymous
    </motion.span>
  );
}
