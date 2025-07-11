"use client";

// React + Tailwind layout for AlumniConnect
import React, { useState } from 'react';
import defaultUser from '../images/default_user.png';
import Image from 'next/image';
import {
  Bell,
  Search,
  Home,
  MessageSquare,
  Users,
  Brain,
  User,
  Settings,
  Info,
  LogOut,
  Image as ImageIcon,
  Hash,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#121217] font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#f1f1f4] px-4 md:px-10 py-3 gap-4">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3 md:gap-6 flex-grow">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 md:gap-3 min-w-[140px]">
            <div className="w-5 h-5 md:w-6 md:h-6">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-lg font-bold md:text-xl truncate whitespace-nowrap">AlumniConnect</h2>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-[#121217]">
          <a href="#" className="hover:text-[#7f6189]">Home</a>
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

      {/* Mobile Nav Icons */}
      <nav className="md:hidden flex justify-around py-2 border-b border-[#f1f1f4] bg-white text-sm">
        <button><Home className="w-5 h-5" /></button>
        <button><MessageSquare className="w-5 h-5" /></button>
        <button><Users className="w-5 h-5" /></button>
        <button><Brain className="w-5 h-5" /></button>
        <button><Bell className="w-5 h-5" /></button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
       <aside
  className={`fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-[#f1f1f4] transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } md:flex flex-col px-6 py-6 items-center gap-6`}
>
  <button
    className="absolute top-4 right-4 md:hidden"
    onClick={() => setSidebarOpen(false)}
  >
    <X className="w-6 h-6" />
  </button>

  {/* Profile image + name */}
  <div className="flex flex-col items-center gap-2">
    <div className="w-24 h-24 rounded-full overflow-hidden">
      <Image
        src={defaultUser}
        alt="Profile"
        width={96}
        height={96}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="text-center">
      <p className="font-bold text-lg">Your Name</p>
      <p className="text-sm text-[#676783]">Your Role</p>
    </div>
  </div>

  {/* Navigation */}
  <nav className="w-full flex flex-col gap-3">
    {[{ label: 'Profile', icon: User }, { label: 'Settings', icon: Settings }, { label: 'About', icon: Info }, { label: 'Logout', icon: LogOut }].map(({ label, icon: Icon }) => (
      <button
        key={label}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#f3f0f4] font-medium"
      >
        <Icon className="w-5 h-5" /> {label}
      </button>
    ))}
  </nav>
</aside>


        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6 md:ml-0 ml-0">
          {/* Post Input Area */}
          <div className="bg-white border border-[#dddde4] rounded-xl">
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-4 border-b border-[#dddde4] rounded-t-xl focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <button><ImageIcon className="text-[#676783] w-5 h-5" /></button>
                <button><Hash className="text-[#676783] w-5 h-5" /></button>
              </div>
              <button className="px-4 py-1 rounded-full bg-[#adadea] text-sm font-medium">Post</button>
            </div>
          </div>

          {/* Dynamic content */}
          <div>
            {children || <p className="text-sm text-gray-500">Select a section from the nav</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
