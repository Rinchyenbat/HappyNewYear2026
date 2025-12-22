'use client';

import { motion } from 'framer-motion';
import { Letter } from '../types/letter';
import Link from 'next/link';
import AnonymousBadge from './AnonymousBadge';
import { AvatarIcon } from '../lib/avatars';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['500', '600', '700'] });

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
          relative cursor-pointer
          ${isInbox ? '' : 'rounded-lg overflow-hidden glass-effect hover:bg-white/10 p-6 letter-shadow'}
          transition-all
        `}
      >
        {isInbox && (
          <>
            {/* Keep envelope fully visible */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="/inbox-envelope.png"
                alt="Envelope"
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 420px, 420px"
                className="object-contain"
                priority={false}
              />

              {/* Sender strip (no 'From:' label) */}
              <div className="absolute left-6 right-6 top-6">
                <div
                  className={
                    dancingScript.className +
                    ' text-snow text-lg md:text-xl drop-shadow-sm truncate max-w-[85%]'
                  }
                  title={isAnonymous ? 'Anonymous' : displayName}
                >
                  {isAnonymous ? 'Anonymous' : displayName}
                </div>
              </div>

              {/* Date + avatar (avatar on the right, date on the left) */}
              <div className="absolute left-6 right-6 bottom-6 flex items-center justify-between">
                <span className="text-xs text-midnight truncate max-w-[70%]">
                  {new Date(letter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>

                <div className="flex items-center gap-2">
                  {isUnread && <span className="inline-block w-2 h-2 bg-gold rounded-full animate-pulse" />}
                  {!isAnonymous && (
                    <div className="h-12 w-12 rounded-md bg-white/10 border border-dashed border-white/20 p-1">
                      <AvatarIcon avatarId={letter.from?.avatarId} frame={false} className="h-full w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!isInbox && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        )}

        {type === 'sent' ? (
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
        ) : null}
      </motion.div>
    </Link>
  );
}
