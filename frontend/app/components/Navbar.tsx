'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAuthToken, getAvatarId, getUserRole, getUsername, logout, setAvatarId } from '../lib/auth';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { AvatarIcon } from '../lib/avatars';

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [avatarId, setAvatarIdState] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsername());
    setRole(getUserRole());
    setAvatarIdState(getAvatarId());

    const token = getAuthToken();
    if (!token) return;

    api
      .get<{ user: { avatarId?: string } }>('/users/profile')
      .then((res) => {
        const next = res.data?.user?.avatarId;
        if (typeof next === 'string' && next.trim()) {
          setAvatarId(next);
          setAvatarIdState(next);
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  const isAdmin = role === 'admin';
  const navItems = isAdmin
    ? [{ href: '/admin', label: 'Admin' }]
    : [
        { href: '/inbox', label: 'Inbox' },
        { href: '/sent', label: 'Sent' },
        { href: '/write', label: 'Write Letter' },
        { href: '/profile', label: 'Profile' }
      ];
  const brandHref = isAdmin ? '/admin' : '/inbox';

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href={brandHref} className="flex items-center space-x-2">
            <span className="text-2xl">✉️</span>
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Happy New Year{username ? `, ${username}!` : '!'}
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2"
                >
                  <span
                    className={`${
                      isActive
                        ? 'text-gold font-semibold'
                        : 'text-snow-dark hover:text-snow transition-colors'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-light"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
              {username && (
                <div className="flex items-center gap-2">
                  <AvatarIcon avatarId={avatarId} className="h-9 w-9" />
                  <span className="text-sm text-snow-dark">{username}</span>
                </div>
              )}
              <button
                onClick={logout}
                className="text-sm text-snow-dark hover:text-gold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
