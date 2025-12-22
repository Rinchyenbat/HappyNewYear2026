'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import SnowEffect from '../components/SnowEffect';
import api from '../lib/api';
import { getUserRole, isAuthenticated, setAvatarId } from '../lib/auth';
import { AVATARS, AvatarIcon, isAvatarId } from '../lib/avatars';

type ProfileResponse = {
  user: {
    id: string;
    username: string;
    role: 'admin' | 'user';
    avatarId: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarId, setAvatarIdState] = useState<string>('penguin-01');
  const [username, setUsername] = useState<string>('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (getUserRole() === 'admin') {
      router.push('/admin');
      return;
    }

    setLoading(true);
    setError('');
    api
      .get<ProfileResponse>('/users/profile')
      .then((res) => {
        const next = res.data?.user;
        if (next?.username) setUsername(next.username);
        if (next?.avatarId) {
          setAvatarId(next.avatarId);
          setAvatarIdState(next.avatarId);
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.error?.message || 'Failed to load profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const save = async () => {
    setError('');
    setSuccess(false);

    if (!isAvatarId(avatarId)) {
      setError('Invalid avatar selected');
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch<ProfileResponse>('/users/profile', { avatarId });
      const next = res.data?.user?.avatarId;
      if (typeof next === 'string' && next.trim()) {
        setAvatarId(next);
        setAvatarIdState(next);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      <Navbar />

      <main className="container mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-snow-dark">Pick your New Year avatar{username ? `, ${username}` : ''}.</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <AvatarIcon avatarId={avatarId} className="h-16 w-16" />
            <div>
              <div className="text-snow font-semibold">Selected</div>
              <div className="text-snow-dark text-sm">
                {AVATARS.find((a) => a.id === avatarId)?.name ?? 'Penguin (01)'}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-snow-dark">Loading…</div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="text-snow-dark text-xs uppercase tracking-wider mb-3">Animals</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {AVATARS.map((a) => {
                    const active = avatarId === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAvatarIdState(a.id)}
                        className={
                          'rounded-2xl p-2 border transition-colors ' +
                          (active
                            ? 'border-gold/60 bg-gold/10'
                            : 'border-white/10 hover:border-white/20 bg-white/5')
                        }
                        aria-pressed={active}
                      >
                        <AvatarIcon avatarId={a.id} frame={false} className="h-14 w-14 mx-auto" title={a.name} />
                        <div className="mt-1 text-[11px] text-snow-dark truncate">{a.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-midnight font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Avatar'}
                </button>
                {success && <div className="text-sm text-gold">Saved!</div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
