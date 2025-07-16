'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="text-sm font-medium mb-6 px-3 py-2 rounded-md transition"
        style={{ backgroundColor: 'transparent', color: 'var(--foreground)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff7300')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
      >
        ← Back to Dashboard
      </button>

      {/* Settings Card */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-black rounded-xl shadow-md p-6 space-y-8"
        style={{ backgroundColor: 'var(--search-bg)', color: 'var(--foreground)' }}>
        <h2 className="text-xl font-bold">Settings</h2>

        {/* General Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General</h3>

          <div className="flex items-center justify-between">
            <span>Theme</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-1 text-sm rounded-full transition font-medium"
              style={{
                backgroundColor: 'var(--button-border)',
                color: '#fff',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff7300')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-border)')}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Language</span>
            <select
              className="bg-transparent border px-3 py-1 rounded-md text-sm"
              style={{ borderColor: 'var(--button-border)', color: 'var(--foreground)' }}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preferences</h3>

          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" className="w-4 h-4 accent-orange-500" />
          </div>

          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input type="checkbox" className="w-4 h-4 accent-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
