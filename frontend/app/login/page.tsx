"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { setAuthToken } from '../lib/auth';
import SnowEffect from '../components/SnowEffect';

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEV_INSTAGRAM_ID = process.env.NEXT_PUBLIC_DEV_INSTAGRAM_ID || '';

function OAuthCallbackHandler({
  onError,
  onLoadingChange,
}: {
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      onError(decodeURIComponent(errorParam));
      onLoadingChange(false);
      return;
    }

    if (token && username) {
      setAuthToken(token, username);
      router.push('/inbox');
    }
  }, [searchParams, router, onError, onLoadingChange]);

  return null;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInstagramLogin = () => {
    setError('');
    setLoading(true);

    // Check if we're in DEV mode (no Instagram App ID configured)
    const isDev = !INSTAGRAM_APP_ID;
    
    if (isDev) {
      // Development mode with DEV_AUTH_BYPASS
      // Backend will handle dev login and redirect back to frontend with token
      const instagramId = DEV_INSTAGRAM_ID.trim();

      if (!instagramId) {
        setError(
          'Development login is not configured. Set NEXT_PUBLIC_DEV_INSTAGRAM_ID to a whitelisted numeric instagram_id (or configure real Instagram OAuth).'
        );
        setLoading(false);
        return;
      }

      window.location.href = `${API_URL}/auth/instagram/callback?instagram_id=${encodeURIComponent(instagramId)}`;
    } else {
      // Production: Redirect to backend /auth/instagram which initiates Instagram OAuth
      window.location.href = `${API_URL}/auth/instagram`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <SnowEffect />

      <Suspense fallback={null}>
        <OAuthCallbackHandler onError={setError} onLoadingChange={setLoading} />
      </Suspense>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            ✉️
          </motion.div>
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            New Year Letters
          </h1>
          <p className="text-snow-dark font-serif">
            Write thoughtful letters to welcome 2026
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect p-8 rounded-lg letter-shadow"
        >
          <div className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              onClick={handleInstagramLogin}
              disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] text-white font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {loading ? 'Connecting to Instagram...' : 'Login with Instagram'}
            </button>

            <div className="mt-6 text-center text-xs text-snow-dark space-y-2">
              <p>✨ Only pre-approved Instagram accounts can access ✨</p>
              <p className="text-snow-dark/70">
                {!INSTAGRAM_APP_ID 
                  ? 'Development mode: Using test authentication'
                  : "You'll be redirected to Instagram to authenticate"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-sm text-snow-dark font-serif italic"
        >
          "Words written from the heart echo through time"
        </motion.p>
      </motion.div>
    </div>
  );
}
