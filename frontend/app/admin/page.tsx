'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import SnowEffect from '../components/SnowEffect';
import api from '../lib/api';
import { getUserRole, isAuthenticated } from '../lib/auth';

type PendingLogin = {
  id: string;
  facebookId: string;
  facebookName: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  seenCount: number;
  lastIp: string | null;
  lastUserAgent: string | null;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<PendingLogin[]>([]);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [approving, setApproving] = useState<Record<string, boolean>>({});

  const isAdmin = useMemo(() => getUserRole() === 'admin', []);

  const fetchPending = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get<{ pending: PendingLogin[] }>('/admin/pending-facebook-logins');
      setPending(res.data.pending);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (facebookId: string) => {
    setError('');
    const username = (usernames[facebookId] || '').trim();
    if (!username) {
      setError('Username is required to approve');
      return;
    }

    setApproving((p) => ({ ...p, [facebookId]: true }));
    try {
      await api.post('/admin/pending-facebook-logins/approve', { facebookId, username });
      setPending((list) => list.filter((p) => p.facebookId !== facebookId));
      setUsernames((u) => {
        const next = { ...u };
        delete next[facebookId];
        return next;
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Approve failed');
    } finally {
      setApproving((p) => ({ ...p, [facebookId]: false }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/inbox');
      return;
    }

    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      <Navbar />

      <main className="container mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Admin Approval
          </h1>
          <p className="text-snow-dark">Approve new logins and assign a username.</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="glass-effect p-6 rounded-lg letter-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-snow">Pending ({pending.length})</h2>
            <button
              onClick={fetchPending}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-midnight font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-snow-dark">Loading...</div>
          ) : pending.length === 0 ? (
            <div className="py-10 text-center text-snow-dark">No pending approvals.</div>
          ) : (
            <div className="space-y-4">
              {pending.map((p) => (
                <div key={p.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-snow font-semibold truncate">
                        {p.facebookName || 'Facebook user'}
                      </div>
                      <div className="text-xs text-snow-dark mt-1 break-all">facebookId: {p.facebookId}</div>
                      <div className="text-xs text-snow-dark mt-1">
                        seen: {p.seenCount} • last seen: {new Date(p.lastSeenAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        value={usernames[p.facebookId] || ''}
                        onChange={(e) => setUsernames((u) => ({ ...u, [p.facebookId]: e.target.value }))}
                        placeholder="username"
                        className="w-48 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-snow placeholder:text-snow-dark focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                      <button
                        onClick={() => approve(p.facebookId)}
                        disabled={Boolean(approving[p.facebookId])}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-midnight font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {approving[p.facebookId] ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
