'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SnowEffect from '../components/SnowEffect';
import api from '../lib/api';
import { getUserRole, isAuthenticated } from '../lib/auth';
import { SendLetterRequest } from '../types/letter';

interface User {
  id: string;
  username: string;
}

export default function WritePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [formData, setFormData] = useState<SendLetterRequest>({
    toUsername: '',
    title: '',
    body: '',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (getUserRole() === 'admin') {
      router.push('/admin');
      return;
    }

    setAuthChecked(true);

    const fetchUsers = async () => {
      try {
        const response = await api.get<{ users: User[] }>('/users');
        setUsers(response.data.users);
      } catch (err) {
        console.error('Failed to load users');
      }
    };

    fetchUsers();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/letters', formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/sent');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send letter');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <SnowEffect />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-serif text-gold">Letter Sealed & Sent!</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Write a Letter
            </h1>
            <p className="text-snow-dark">
              Take your time. Write from the heart. ✍️
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-8 rounded-lg letter-shadow"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient */}
              <div>
                <label htmlFor="toUsername" className="block text-sm font-medium text-snow-dark mb-2">
                  To
                </label>
                <select
                  id="toUsername"
                  value={formData.toUsername}
                  onChange={(e) => setFormData({ ...formData, toUsername: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-snow focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  required
                  disabled={loading}
                >
                  <option value="">Select a recipient</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.username} className="bg-midnight text-snow">
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-snow-dark mb-2">
                  Title (optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Give your letter a title..."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-snow placeholder-snow-dark/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Body */}
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-snow-dark mb-2">
                  Your Letter
                </label>
                <textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write your heartfelt message here... Take as much space as you need."
                  rows={16}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-snow placeholder-snow-dark/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none font-serif leading-relaxed"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-snow-dark">
                  {formData.body.length} / 20,000 characters
                </p>
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <input
                  id="isAnonymous"
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  disabled={loading}
                />
                <label htmlFor="isAnonymous" className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-snow">Send anonymously</span>
                  <span className="text-xs text-snow-dark">
                    (Your identity will be hidden from the recipient)
                  </span>
                </label>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-snow hover:bg-white/10 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-midnight font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Sealing...' : '✉️ Seal & Send'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
