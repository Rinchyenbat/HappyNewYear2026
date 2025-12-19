'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import LetterCard from '../components/LetterCard';
import SnowEffect from '../components/SnowEffect';
import api from '../lib/api';
import { isAuthenticated } from '../lib/auth';
import { LettersResponse } from '../types/letter';

export default function InboxPage() {
  const [letters, setLetters] = useState<LettersResponse['letters']>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setAuthChecked(true);

    const fetchInbox = async () => {
      try {
        const response = await api.get<LettersResponse>('/letters/inbox');
        setLetters(response.data.letters);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load inbox');
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [router]);

  if (!authChecked) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Your Inbox
          </h1>
          <p className="text-snow-dark">
            Letters written to you with love and care
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              <p className="mt-4 text-snow-dark">Loading your letters...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-effect p-6 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : letters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect p-12 rounded-lg text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-serif mb-2 text-snow-dark">No letters yet</h2>
            <p className="text-snow-dark/70">
              Your inbox is empty. When someone sends you a letter, it will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {letters.map((letter, index) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LetterCard letter={letter} type="inbox" />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
