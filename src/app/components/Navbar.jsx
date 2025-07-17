'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Home, MessageSquare, Users, Brain, Bell } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const Navbar = ({ setSidebarOpen = null, user = null }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const handleSearchFocus = () => {
    router.push('/search');
  };
  return (
    <>
      {/* Top Navbar */}
      <header
        className="flex items-center justify-between border-b px-4 md:px-10 py-3 gap-4"
        style={{
          backgroundColor: 'var(--navbar-bg)',
          borderColor: 'var(--sidebar-border)',
          color: 'var(--navbar-text)',
        }}
      >
        {/* Left: Just Brand Name */}
        <div className="flex items-center gap-3 md:gap-6 flex-grow">
          {setSidebarOpen && (
            <button className="md:hidden" onClick={() => setSidebarOpen(prev => !prev)}>
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="User"
                  className="w-8 h-8 rounded-full border"
                  style={{
                    borderColor: theme === 'dark' ? 'var(--navbar-text)' : "",
                    borderWidth: theme === 'dark' ? '2px' : '0px',
                    borderStyle: 'solid',
                  }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold"
                  style={{ color: 'var(--navbar-text)' }}
                >
                  
                </div>
              )}
            </button>
          )}


          <h2
            className="text-lg font-bold md:text-xl truncate whitespace-nowrap"
            style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }} // text-gray-900
          >
            AlumniConnect
          </h2>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {[
            { label: 'Home', href: '/dashboard' },
            { label: 'Chats', href: '/chats' },
            { label: 'Community', href: '/community' },
            { label: 'AI', href: '/ai' },


          ].map(({ label, href }) => (
            <Link key={label} href={href}>
              <span
                className="transition-colors cursor-pointer"
                style={{ color: 'var(--navbar-text)' }}
                onMouseEnter={(e) => (e.target.style.color = '#ff7300')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--navbar-text)')}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>


        {/* Right: Search, Bell */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5" style={{ color: 'var(--search-placeholder)' }} />
            </div>
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Search alumni..."
              onFocus={handleSearchFocus}
           
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm cursor-pointer"
              style={{
                backgroundColor: 'var(--search-bg)',
                color: 'var(--search-text)',
              }}
            />

          </div>

          {/* Mobile Search Icon */}
          <button
            className="rounded-full p-2 md:hidden"
            style={{ backgroundColor: 'var(--search-bg)' }}
            onClick={() => router.push('/search')}
          >
            <Search className="w-5 h-5" style={{ color: 'var(--search-text)' }} />
          </button>

        </div>

        {/* Bell Icon */}
        <button
          onMouseEnter={(e) => (e.currentTarget.firstChild.style.color = '#ff7300')}
          onMouseLeave={(e) => (e.currentTarget.firstChild.style.color = 'var(--navbar-text)')}
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--navbar-text)' }} />
        </button>
      </header>

      {/* Bottom Mobile Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 border-t text-sm shadow-md"
        style={{
          backgroundColor: 'var(--navbar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex justify-around py-2">
          {[
            { label: 'Home', href: '/dashboard', icon: Home },
            { label: 'Messages', href: '/chats', icon: MessageSquare },
            { label: 'Community', href: '/community', icon: Users },
            { label: 'AI', href: '/ai', icon: Brain },

          ].map(({ href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div
                className="p-2"
                onMouseEnter={(e) => (e.currentTarget.firstChild.style.color = '#ff7300')}
                onMouseLeave={(e) => (e.currentTarget.firstChild.style.color = 'var(--navbar-text)')}
              >
                <Icon className="w-5 h-5 transition-colors" style={{ color: 'var(--navbar-text)' }} />
              </div>
            </Link>
          ))}
        </div>

      </nav>
    </>
  );
};

export default Navbar;
