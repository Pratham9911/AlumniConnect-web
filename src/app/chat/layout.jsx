'use client';

import { usePathname } from 'next/navigation';
import ChatSidebar from './ChatSidebar';
import Navbar from '../components/Navbar';

export default function ChatLayout({ children }) {
  const pathname = usePathname();
  const isChatRoot = pathname === '/chat';

  return (
    <div className="flex h-screen w-full">
       
      {/* Desktop sidebar */}
      <div className="hidden md:block w-[380px] border-r border-[var(--sidebar-border)]">
        
        <ChatSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {/* On mobile, show sidebar instead of fallback when at /chat */}
        <div className="md:hidden h-full">
          
          {isChatRoot ? <ChatSidebar /> : children}
        </div>

        {/* On desktop, show children */}
        <div className="hidden md:block h-screen overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
