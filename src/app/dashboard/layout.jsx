"use client";

// React + Tailwind layout for AlumniConnect
import { auth } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import defaultUser from '../images/default_user.png';
import Image from 'next/image';
import Navbar from '../components/Navbar';
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

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';



export default function DashboardLayout({ children }) {
 //sign out part

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();


  // Login part
  const [userData, setUserData] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if(user)
    {
       const userDoc = await getDoc(doc(db, 'users',user.uid))
       if(userDoc.exists()){
        setUserData(userDoc.data());
       }
    }
  })

  return() => unsubscribe()
},[]);


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/login'); // useRouter from next/navigation
    }
  });

  return () => unsubscribe();
}, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className=" min-h-screen bg-white text-[#121217] font-sans flex flex-col">
      {/* Top Navigation */}
      <Navbar setSidebarOpen={setSidebarOpen} />

      

      <div className="flex flex-1">
        {/* Sidebar */}
       <aside
  className={`fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-[#f1f1f4] transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } md:flex flex-col px-6 py-6 items-center gap-6`}
>
  <button
    className="absolute top-4 left-4 md:hidden"
    onClick={() => setSidebarOpen(false)}
  >
    <X className="w-6 h-6" />
  </button>

  {/* Profile image + name */}
  <div className="flex flex-col items-center gap-2">
    <div className="w-24 h-24 rounded-full overflow-hidden">
      <Image
  src={userData?.profileImageUrl || defaultUser}
  alt="Profile"
  width={96}
  height={96}
  className="w-full h-full object-cover"
/>
    </div>
    <div className="text-center">
      <p className="font-bold text-lg">{userData?.name || 'Loading...'}</p>
      <p className="text-sm text-[#676783]">{userData?.role || 'Loading...'}</p>
    </div>
  </div>

  {/* Navigation */}
<nav className="w-full flex flex-col gap-3">
  {[{ label: 'Profile', icon: User },
    { label: 'Settings', icon: Settings },
    { label: 'About', icon: Info },
    { label: 'Logout', icon: LogOut }
  ].map(({ label, icon: Icon }) => (
    <button
      key={label}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#f3f0f4] font-medium w-full text-left"
      onClick={() => {
  if (label === 'Logout') {
    setShowLogoutConfirm(true);
  } else if (label === 'Profile') {
    router.push(`/profile/${userData?.uid}`);
  } else {
    console.log(`${label} clicked`);
  }
}}
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
    {showLogoutConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm animate-scaleIn">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Are you sure you want to logout?
      </h3>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => setShowLogoutConfirm(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
          onClick={async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (err) {
              console.error("Logout failed:", err);
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}


    </div>
      
  );
}
