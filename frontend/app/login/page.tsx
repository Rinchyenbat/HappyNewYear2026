"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { setAuthToken } from '../lib/auth';
import SnowEffect from '../components/SnowEffect';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEV_FACEBOOK_ID = process.env.NEXT_PUBLIC_DEV_FACEBOOK_ID || '';

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

  const handleFacebookLogin = () => {
    setError('');
    setLoading(true);

    // DEV bypass is opt-in and should only be used when explicitly configured.
    // In production, the normal path is always to redirect to the backend OAuth initiate endpoint.
    const facebookId = DEV_FACEBOOK_ID.trim();
    const useDevBypass = Boolean(facebookId);

    if (useDevBypass) {
      window.location.href = `${API_URL}/auth/facebook/callback?facebook_id=${encodeURIComponent(facebookId)}`;
      return;
    }

    window.location.href = `${API_URL}/auth/facebook`;
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
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] text-white font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12.061C22 6.504 17.523 2 12 2S2 6.504 2 12.061C2 17.082 5.657 21.245 10.438 22v-7.03H7.898v-2.909h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476H15.19c-1.246 0-1.634.776-1.634 1.572v1.886h2.78l-.444 2.909h-2.336V22C18.343 21.245 22 17.082 22 12.061z"/>
              </svg>
              {loading ? 'Connecting to Facebook...' : 'Login with Facebook'}
            </button>

            <div className="mt-6 text-center text-xs text-snow-dark space-y-2">
              <p>✨ After login, your account may require admin approval ✨</p>
              <p className="text-snow-dark/70">
                {DEV_FACEBOOK_ID.trim()
                  ? 'Development mode: Using test authentication'
                  : "You'll be redirected to Facebook to authenticate"}
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
