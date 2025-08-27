'use client';

import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/app/firebase/config";

export default function ChatFallback() {
  const { theme } = useAuth(); // 'light' or 'dark'

  // Helper to read CSS variables dynamically
  const getVar = (varName) => `var(--${varName})`;

  const backgroundColor = getVar('background');  ;
  const textColor = theme === 'dark' ? getVar('foreground') : getVar('foreground');
  const msgBg = getVar('msgcolor');
  const msgText = theme === 'dark' ? getVar('foreground') : getVar('foreground');

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full"
      style={{ backgroundColor, color: textColor }}
    >
      {/* Desktop Navbar */}
      <div className="hidden md:block w-full h-16 sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Default message */}
      <div className="flex items-center justify-center flex-1 w-full">
        <p
          className="px-4 py-2 rounded-2xl text-center"
          style={{
            backgroundColor: msgBg,
            color: msgText,
          }}
        >
          Select a chat to start messaging
        </p>
      </div>
    </div>
  );
}
