'use client';

import React from 'react';
import { Menu, Search, Home, MessageSquare, Users, Brain, Bell } from 'lucide-react';
import Link from 'next/link';

const Navbar = ({ setSidebarOpen = null }) => {
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
        {/* Left: Logo and Menu */}
        <div className="flex items-center gap-3 md:gap-6 flex-grow">
          {setSidebarOpen && (
            <button className="md:hidden" onClick={() => setSidebarOpen(prev => !prev)}>
              <Menu className="w-6 h-6" style={{ color: 'var(--navbar-text)' }} />
            </button>
          )}
          <div className="flex items-center gap-2 md:gap-3 min-w-[140px]">
            <div className="w-5 h-5 md:w-6 md:h-6">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h2
              className="text-lg font-bold md:text-xl truncate whitespace-nowrap"
              style={{ color: 'var(--navbar-text)' }}
            >
              AlumniConnect
            </h2>
          </div>
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

        {/* Right: Search and Bell */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5" style={{ color: 'var(--search-placeholder)' }} />
            </div>
            <input
              type="text"
              placeholder="Search alumni..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--search-bg)',
                color: 'var(--search-text)',
              }}
            />
          </div>

          {/* Mobile Search Icon */}
          <button className="rounded-full p-2 md:hidden" style={{ backgroundColor: 'var(--search-bg)' }}>
            <Search className="w-5 h-5" style={{ color: 'var(--search-text)' }} />
          </button>
        </div>

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
