'use client';

import React from 'react';
import { Menu, Search } from 'lucide-react';

const Navbar = ({ setSidebarOpen = null }) => {
  return (
    <header className="flex items-center justify-between border-b border-[#f1f1f4] px-4 md:px-10 py-3 gap-4">
      {/* Left: Logo and App Name */}
      <div className="flex items-center gap-3 md:gap-6 flex-grow">
        {/* Menu icon only shown if setSidebarOpen is provided (dashboard layout) */}
        {setSidebarOpen && (
          <button className="md:hidden" onClick={() => setSidebarOpen(prev => !prev)}>
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center gap-2 md:gap-3 min-w-[140px]">
          <div className="w-5 h-5 md:w-6 md:h-6">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="black" />
            </svg>
          </div>
          <h2 className="text-lg text-black font-bold md:text-xl truncate whitespace-nowrap">AlumniConnect</h2>
        </div>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#121217]">
        <a href="/dashboard" className="hover:text-[#7f6189]">Home</a>
        <a href="#" className="hover:text-[#7f6189]">Chats</a>
        <a href="#" className="hover:text-[#7f6189]">Community</a>
        <a href="#" className="hover:text-[#7f6189]">AI</a>
      </nav>

      {/* Right: Search + Profile */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-[#676783]" />
          </div>
          <input
            type="text"
            placeholder="Search alumni..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f1f1f4] placeholder:text-[#676783] text-sm"
          />
        </div>
        <button className="rounded-full p-2 bg-[#f1f1f4] md:hidden">
          <Search className="w-5 h-5 text-[#121217]" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
