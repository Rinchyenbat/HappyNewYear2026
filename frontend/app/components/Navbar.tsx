'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUsername, logout } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  const navItems = [
    { href: '/inbox', label: 'Inbox' },
    { href: '/sent', label: 'Sent' },
    { href: '/write', label: 'Write Letter' },
  ];

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/inbox" className="flex items-center space-x-2">
            <span className="text-2xl">✉️</span>
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              New Year Letters
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
                <span className="text-sm text-snow-dark">
                  {username}
                </span>
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
