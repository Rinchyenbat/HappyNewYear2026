'use client';

import { motion } from 'framer-motion';
import { Letter } from '../types/letter';
import Link from 'next/link';
import AnonymousBadge from './AnonymousBadge';
import { AvatarIcon } from '../lib/avatars';

interface LetterCardProps {
  letter: Letter;
  type?: 'inbox' | 'sent';
}

export default function LetterCard({ letter, type = 'inbox' }: LetterCardProps) {
  const isInbox = type === 'inbox';
  const isUnread = type === 'inbox' && !letter.isRead;
  const displayName = letter.from?.username || 'Unknown';
  const isAnonymous = Boolean(letter.isAnonymous);

  return (
    <Link href={`/letter/${letter.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3 }}
        className={`
          relative p-6 rounded-lg cursor-pointer overflow-hidden
          ${isInbox ? 'border border-white/10 bg-white/5' : 'glass-effect hover:bg-white/10'}
          transition-all letter-shadow
          ${isUnread ? 'border-2 border-gold/50' : ''}
        `}
      >
        {isInbox && (
          <>
            <div className="absolute inset-0 bg-[url('/inbox-envelope.png')] bg-cover bg-center opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-br from-midnight/70 via-midnight/35 to-midnight/70" />
          </>
        )}

        {/* Envelope shine */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {type === 'inbox' ? (
          <>
            {/* Stamp */}
            {!isAnonymous && (
              <div className="absolute top-4 right-4">
                <div className="h-14 w-14 rounded-md bg-white/10 border border-dashed border-white/20 p-1">
                  <AvatarIcon avatarId={letter.from?.avatarId} frame={false} className="h-full w-full" />
                </div>
              </div>
            )}

            <div className="relative z-10">
              {!isAnonymous && (
                <div className="flex items-center gap-2 mb-2 pr-16">
                  <span className="text-sm text-snow-dark">From:</span>
                  <span className={`${isUnread ? 'font-bold text-gold' : 'text-snow'}`}>{displayName}</span>
                </div>
              )}

              <h3
                className={`text-xl font-serif leading-snug pr-16 ${
                  isUnread ? 'font-bold text-snow' : 'text-snow-dark'
                }`}
              >
                {letter.title || 'Untitled Letter'}
              </h3>

              <div className="mt-6 flex items-center justify-between text-xs text-snow-dark">
                <span>
                  {new Date(letter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>

                {isUnread && (
                  <span className="inline-block w-2 h-2 bg-gold rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-snow-dark">To:</span>
                  <span className="text-snow">{letter.to?.username}</span>
                  {isAnonymous && <AnonymousBadge />}
                </div>

                <h3 className={`text-lg font-serif ${isUnread ? 'font-bold text-snow' : 'text-snow-dark'}`}>
                  {letter.title || 'Untitled Letter'}
                </h3>
              </div>
            </div>

            {letter.body ? (
              <p className="text-sm text-snow-dark line-clamp-2 leading-relaxed">{letter.body}</p>
            ) : null}

            <div className="mt-4 flex items-center justify-between text-xs text-snow-dark">
              <span>
                {new Date(letter.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </>
        )}
      </motion.div>
    </Link>
  );
}
