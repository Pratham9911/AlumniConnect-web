'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/firebase/config';
import axios from 'axios';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { Home, MessageSquare, Users, Brain } from 'lucide-react'; // icons for navbar
import { io } from 'socket.io-client';

export default function ChatSidebar() {
   const socket = io(`${process.env.NEXT_PUBLIC_API_BASE}`, {
  transports: ['websocket'], // forces WS only (skip polling)
  withCredentials: true,
}); // or your live backend URL
    const { currentUser, theme } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState('');
    const [userInfoMap, setUserInfoMap] = useState({});


    useEffect(() => {
        if (!currentUser?.uid) return;
        socket.emit('user-online', currentUser.uid);
    }, [currentUser]);

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        socket.on('online-users', (list) => {
            setOnlineUsers(list);
        });

        return () => socket.off('online-users');
    }, []);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const fetchConversations = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/conversations/${currentUser.uid}`);
            setConversations(res.data);

            const userMap = {};
            await Promise.all(
                res.data.map(async (conv) => {
                    const otherUid = conv.members.find((m) => m !== currentUser.uid);
                    if (!otherUid) return;
                    try {
                        const snap = await getDoc(doc(db, 'users', otherUid));
                        const data = snap.exists() ? snap.data() : null;
                        userMap[otherUid] = {
                            name: data?.name || 'User',
                            image: data?.profileImageUrl || null,
                        };
                    } catch (err) {
                        userMap[otherUid] = {
                            name: 'User',
                            image: null,
                        };
                    }
                })
            );

            setUserInfoMap(userMap);
        };

        fetchConversations();
    }, [currentUser]);

    const filtered = conversations.filter((conv) => {
        const otherUid = conv.members.find((m) => m !== currentUser.uid);
        const name = userInfoMap[otherUid]?.name || '';
        return name.toLowerCase().includes(search.toLowerCase());
    });


    return (
        <div
            className="flex flex-col h-full w-full md:w-[380px]"
            style={{

                backgroundColor: theme === 'dark' ? '#FFFFFF' : 'var(--blue-bg)',
                color: theme === 'dark' ? '#ffffff' : 'var(--foreground)',
                borderRight: theme === 'dark' ? '1px solid #1F1F2E' : '1px solid var(--sidebar-border1)',
                borderRadius: theme === 'dark' ? '12px 0 0 12px' : '0px',
            }}

        >

            {/* Header */}
            <div
                className="px-4 py-3 text-xl font-bold"
                style={{
                    color: '#3754bd',
                    fontWeight: 'bold',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                Chats
            </div>
            {/* search */}
            <div className="px-4 py-3">
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                        backgroundColor: 'var(--blue-searchBG)',
                        border: theme === 'dark' ? '1px solid #2A2A3B' : 'none',
                        boxShadow: theme === 'dark' ? '0 0 10px rgba(136, 84, 208, 0.4)' : 'none',
                    }}

                >
                    <Search className="h-4 w-4 text-[#8884D0]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search User..."
                        className="bg-transparent flex-1 text-sm focus:outline-none"
                        style={{
                            color: 'var(--blue-text)',
                            '::placeholder': {
                                color: 'var(--blue-search)',
                            },
                        }}
                    />


                </div>
            </div>


            {/* Chat List */}
            <div className="flex-1 overflow-y-auto pb-[56px]">
                {filtered.map((conv) => {
                    const otherUid = conv.members.find((m) => m !== currentUser.uid);
                    const info = userInfoMap[otherUid] || {};
                    return (
                        <Link key={conv._id} href={`/chat/${otherUid}`}>
                            <div
                                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--search-bg)] cursor-pointer transition-all"
                                style={{
                                    borderColor: theme === 'dark' ? '#ffffff20' : '#f1f1f4',
                                    borderRadius: '0.5rem',
                                }}
                            >
                                <div className="relative">
                                    <img
                                        src={info.image || 'https://cdn-icons-png.flaticon.com/512/295/295128.png'}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {onlineUsers.includes(otherUid) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="font-medium text-sm">{info.name || otherUid}</div>
                                    {onlineUsers.includes(otherUid) ?
                                        (
                                            <div className="text-sm text-green-500 truncate">
                                                 Online
                                            </div>
                                        ) : <div className="text-sm text-gray-400 truncate">
                                             Offline
                                        </div>}

                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Navbar (mobile only) */}
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
                        { label: 'Messages', href: '/chat', icon: MessageSquare },
                        { label: 'Community', href: '/community', icon: Users },
                        { label: 'AI', href: '/ai', icon: Brain },
                    ].map(({ href, icon: Icon }) => (
                        <Link key={href} href={href}>
                            <div
                                className="p-2"
                                onMouseEnter={(e) =>
                                    (e.currentTarget.firstChild.style.color = '#ff7300')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.firstChild.style.color = 'var(--navbar-text)')
                                }
                            >
                                <Icon
                                    className="w-5 h-5 transition-colors"
                                    style={{ color: 'var(--navbar-text)' }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
