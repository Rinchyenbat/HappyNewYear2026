'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Letter } from '../types/letter';
import AnonymousBadge from './AnonymousBadge';

interface LetterPaperProps {
  letter: Letter;
  isOpen: boolean;
}

export default function LetterPaper({ letter, isOpen }: LetterPaperProps) {
  const displayName = letter.from?.username || 'Unknown';
  const isAnonymous = displayName === 'Anonymous';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-snow text-midnight p-12 rounded-lg letter-shadow">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjMDAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgb3BhY2l0eT0iLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2dyYWluKSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz48L3N2Zz4=')]" />
            
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pine via-gold to-pine opacity-30" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 pb-6 border-b-2 border-midnight/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-midnight/60 font-serif">From:</span>
                      {isAnonymous ? (
                        <AnonymousBadge />
                      ) : (
                        <span className="font-semibold text-pine">{displayName}</span>
                      )}
                    </div>
                    {letter.to && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-midnight/60 font-serif">To:</span>
                        <span className="font-semibold text-pine">{letter.to.username}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-midnight/60 font-serif">
                    {new Date(letter.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                {letter.title && (
                  <h1 className="text-3xl font-serif font-bold text-midnight mb-2">
                    {letter.title}
                  </h1>
                )}
              </div>

              {/* Body */}
              <div className="prose prose-lg prose-midnight max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-midnight/90 font-serif text-lg">
                  {letter.body}
                </p>
              </div>

              {/* Footer decoration */}
              <div className="mt-12 pt-6 border-t-2 border-midnight/10">
                <div className="flex items-center justify-center gap-2 text-gold/60">
                  <span className="text-2xl">✨</span>
                  <span className="text-sm font-serif italic">Happy New Year 2026</span>
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
