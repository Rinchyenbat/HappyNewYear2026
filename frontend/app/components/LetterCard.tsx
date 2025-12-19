'use client';

import { motion } from 'framer-motion';
import { Letter } from '../types/letter';
import Link from 'next/link';
import AnonymousBadge from './AnonymousBadge';

interface LetterCardProps {
  letter: Letter;
  type?: 'inbox' | 'sent';
}

export default function LetterCard({ letter, type = 'inbox' }: LetterCardProps) {
  const isUnread = type === 'inbox' && !letter.isRead;
  const displayName = letter.from?.username || 'Unknown';
  const isAnonymous = displayName === 'Anonymous';

  return (
    <Link href={`/letter/${letter.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3 }}
        className={`
          relative p-6 rounded-lg cursor-pointer
          glass-effect hover:bg-white/10 transition-all
          letter-shadow
          ${isUnread ? 'border-2 border-gold/50' : 'border border-white/10'}
        `}
      >
        {/* Envelope visual effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {type === 'inbox' ? (
                <>
                  <span className="text-sm text-snow-dark">From:</span>
                  {isAnonymous ? (
                    <AnonymousBadge />
                  ) : (
                    <span className={`${isUnread ? 'font-bold text-gold' : 'text-snow'}`}>
                      {displayName}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-sm text-snow-dark">To:</span>
                  <span className="text-snow">{letter.to?.username}</span>
                </>
              )}
            </div>
            
            <h3 className={`text-lg font-serif ${isUnread ? 'font-bold text-snow' : 'text-snow-dark'}`}>
              {letter.title || 'Untitled Letter'}
            </h3>
          </div>

          {isUnread && (
            <div className="flex-shrink-0 ml-4">
              <span className="inline-block w-2 h-2 bg-gold rounded-full animate-pulse" />
            </div>
          )}
        </div>

        <p className="text-sm text-snow-dark line-clamp-2 leading-relaxed">
          {letter.body}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-snow-dark">
          <span>{new Date(letter.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          
          {isAnonymous && type === 'sent' && (
            <span className="text-winter-purple">Anonymous</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
