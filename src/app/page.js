// app/page.jsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-gray-900 dark:text-white px-6">
      
      {/* App Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-4 text-center">
        Welcome to AlumniConnect
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-8">
        Reconnect with your college network, share opportunities, and grow your professional circle — all in one place.
      </p>

      {/* Single CTA Button */}
      <Link
        href="/dashboard"
        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-full transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
