'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import LetterPaper from '../../components/LetterPaper';
import SnowEffect from '../../components/SnowEffect';
import api from '../../lib/api';
import { isAuthenticated } from '../../lib/auth';
import { Letter, LetterResponse } from '../../types/letter';

export default function LetterDetailPage() {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchLetter = async () => {
      try {
        const response = await api.get<LetterResponse>(`/letters/${id}`);
        setLetter(response.data.letter);
        
        // Mark as read if not already
        if (!response.data.letter.isRead) {
          await api.patch(`/letters/${id}/read`);
        }

        // Delay the letter opening animation
        setTimeout(() => setIsOpen(true), 300);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load letter');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id, router]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4"
              >
                ✉️
              </motion.div>
              <p className="text-snow-dark">Opening your letter...</p>
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect p-12 rounded-lg text-center max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-4">📪</div>
            <h2 className="text-2xl font-serif mb-2 text-snow-dark">Letter Not Found</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/inbox')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-midnight font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Back to Inbox
            </button>
          </motion.div>
        ) : letter ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-snow-dark hover:text-gold transition-colors"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            </motion.div>
            
            <LetterPaper letter={letter} isOpen={isOpen} />
          </>
        ) : null}
      </main>
    </div>
  );
}
