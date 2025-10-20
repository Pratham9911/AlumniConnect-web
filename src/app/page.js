"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Network, GraduationCap, Brain, MessageCircle, Target, Globe } from "lucide-react";
import Link from "next/link";
export default function HomePage() {
  const [users, setUsers] = useState(0);
  const [connections, setConnections] = useState(0);
  const [mentorships, setMentorships] = useState(0);

  const statsRef = useRef(null);

  // Detect when the section is in view
  const isInView = useInView(statsRef, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView) return;

    const animateCount = (setter, end) => {
      let start = 0;
      const duration = 10000;
      const step = Math.ceil(end / (duration / 64));
      const interval = setInterval(() => {
        start += step;
        if (start >= end) {
          setter(end);
          clearInterval(interval);
        } else {
          setter(start);
        }
      }, 64);
    };

    animateCount(setUsers, 86);
    animateCount(setConnections, 56);
    animateCount(setMentorships, 6);
  }, [isInView]);

  return (
    <div className="bg-[#0B0B10] text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 md:px-16 py-6 backdrop-blur-md bg-black/20 fixed top-0 left-0 w-full z-50">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
          AlumniConnect
        </h1>
        <nav className="hidden md:flex gap-8 text-gray-300">
          <a href="#features" className="hover:text-orange-400">Features</a>
          <a href="#journey" className="hover:text-orange-400">Journey</a>
          <a href="#stats" className="hover:text-orange-400">Stats</a>
          <a href="#contact" className="hover:text-orange-400">Contact</a>
        </nav>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition">
          Get Started
        </button>
      </header>

      {/* Hero */}
      <section
        className="relative flex flex-col md:flex-row items-center justify-between px-10 md:px-20 pt-40 pb-28"
        style={{
          backgroundImage: "url('/earth.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
              Empowering Alumni
            </span>
            <span className="block mt-2">Connections through AI</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Reconnect with your college network, share opportunities, and grow your
            professional circle — all in one place.
          </motion.p>

          <div className="flex gap-4 mt-8">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-transform">
                Dashboard
              </button>
            </Link>

            <Link href="/login">
              <button className="px-6 py-3 border border-orange-400 rounded-xl hover:bg-orange-400/10 transition">
                Join the Network
              </button>
            </Link>
          </div>
        </div>

        <motion.img
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          src="/robo.png"
          alt="AI Robot"
          className="relative z-10 w-[360px] mt-12 md:mt-0"
        />
      </section>

      {/* Stats */}
      <section ref={statsRef} id="stats" className="text-center py-24 bg-gradient-to-b from-[#0B0B10] to-[#12121A]">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          A Vibrant Network of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
            Learners & Leaders
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-12">Connected by purpose, powered by AI</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24">
          <Stat icon={<Users size={40} />} value={users} label="Active Users" />
          <Stat icon={<Network size={40} />} value={connections} label="Connections Made" />
          <Stat icon={<GraduationCap size={40} />} value={mentorships} label="Mentorship Programs" />
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-24 bg-gradient-to-b from-[#12121A] to-[#1B1B25] text-center px-6 md:px-20">
        <h2 className="text-4xl font-bold mb-14">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
            Your Journey
          </span>{" "}
          on Alumni Connect
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          <JourneyCard title="Sign Up" desc="Create your alumni profile in minutes." />
          <JourneyCard title="Connect" desc="AI suggests meaningful connections for you." />
          <JourneyCard title="Collaborate" desc="Engage with mentors and share opportunities." />
          <JourneyCard title="Grow" desc="Track your impact and professional journey." />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gradient-to-b from-[#1B1B25] to-[#0B0B10] text-center px-6 md:px-20">
        <h2 className="text-4xl font-bold mb-14">
          Key{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
            Features
          </span>
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          <FeatureCard icon={<Brain size={36} />} title="AI Mentor" desc="Personalized mentorship suggestions." />
          <FeatureCard icon={<MessageCircle size={36} />} title="Real-time Chat" desc="Connect instantly with alumni." />
          <FeatureCard icon={<Target size={36} />} title="Goal Tracker" desc="Track your career milestones." />
          <FeatureCard icon={<Globe size={36} />} title="Global Network" desc="Engage with alumni worldwide." />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-10 text-center bg-[#0B0B10] border-t border-gray-800">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>

        <div className="mt-3 text-sm text-gray-500">
          Made by <span className="text-orange-400">Pratham Tiwari</span>
        </div>
      </footer>
    </div>
  );
}

// ---------------------- Components -----------------------

function Stat({ value, label, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="text-orange-400 mb-2">{icon}</div>
      <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
        {value}+
      </h3>
      <p className="text-gray-300 mt-2 text-lg">{label}</p>
    </motion.div>
  );
}

function JourneyCard({ title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#101018] rounded-2xl p-6 border border-gray-800 hover:border-orange-500 transition-all"
    >
      <h3 className="text-xl font-semibold text-orange-400 mb-3">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-[#101018] rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition-all flex flex-col items-center"
    >
      <div className="text-purple-400 mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-orange-400">{title}</h3>
      <p className="text-gray-400 text-center">{desc}</p>
    </motion.div>
  );
}
