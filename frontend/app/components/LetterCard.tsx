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
          relative rounded-lg cursor-pointer overflow-hidden
          ${isInbox ? 'border border-white/10 bg-white/5' : 'glass-effect hover:bg-white/10 p-6'}
          transition-all letter-shadow
          ${isUnread ? 'border-2 border-gold/50' : ''}
        `}
      >
        {isInbox && (
          <>
            {/* Keep envelope fully visible */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/inbox-envelope.png"
                alt="Envelope"
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 420px, 420px"
                className="object-contain"
                priority={false}
              />
              {/* Readability overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-midnight/55 via-midnight/20 to-midnight/55" />

              {/* Sender strip (no 'From:' label) */}
              <div className="absolute left-6 right-6 top-5 flex items-center justify-between">
                <div className={`${dancingScript.className} text-snow text-xl md:text-2xl drop-shadow-sm`}>
                  {isAnonymous ? 'Anonymous' : displayName}
                </div>

                {!isAnonymous && (
                  <div className="h-14 w-14 rounded-md bg-white/10 border border-dashed border-white/20 p-1">
                    <AvatarIcon avatarId={letter.from?.avatarId} frame={false} className="h-full w-full" />
                  </div>
                )}
              </div>

              {/* Title + date */}
              <div className="absolute left-6 right-6 top-[38%]">
                <h3 className={`text-xl font-serif leading-snug ${isUnread ? 'font-bold text-snow' : 'text-snow-dark'}`}>
                  {letter.title || 'Untitled Letter'}
                </h3>
              </div>
              <div className="absolute left-6 right-6 bottom-6 flex items-center justify-between text-xs text-snow-dark">
                <span>
                  {new Date(letter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>

                {isUnread && <span className="inline-block w-2 h-2 bg-gold rounded-full animate-pulse" />}
              </div>
            </div>
          </>
        )}

        {!isInbox && (
          <>
            {/* Envelope shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </>
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
