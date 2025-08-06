'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/firebase/config';
import { io } from 'socket.io-client';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const socket = io(`${process.env.NEXT_PUBLIC_API_BASE}`); // or your live URL

export default function ChatWithUser() {
  const { uid: otherUserUid } = useParams(); // UID of the user you're chatting with
  const { currentUser, theme } = useAuth();
  const [otherUser, setOtherUser] = useState({ name: '', image: null });
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // STEP 1: Setup conversation
  useEffect(() => {
    if (!currentUser?.uid || !otherUserUid) return;

    const setupChat = async () => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/api/conversations`, {
          senderId: currentUser.uid,
          receiverId: otherUserUid,
        });

        const convo = res.data;
        setConversationId(convo._id);

        // Join socket room
        socket.emit('join-conversation', convo._id);

        // Fetch previous messages
        const msgRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${convo._id}?limit=50`
        );
        setMessages(msgRes.data);

        const userSnap = await getDoc(doc(db, 'users', otherUserUid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setOtherUser({
            name: data.name || 'User',
            image: data.profileImageUrl || null,
          });
        }
      } catch (err) {
        console.error('Chat setup error:', err.message);
      }
    };

    setupChat();
  }, [otherUserUid, currentUser]);

  // STEP 2: Listen for new incoming messages
  useEffect(() => {
    socket.on('receive-message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => socket.off('receive-message');
  }, []);

  // STEP 3: Scroll to bottom on new messages
  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !conversationId) return;

    const msgData = {
      conversationId,
      sender: currentUser.uid,
      text,
    };

    socket.emit('send-message', msgData);
    setText('');
  };

useEffect(() => {
  if (socket && conversationId && currentUser?.uid) {
    console.log('📤 Emitting mark-messages-seen:', conversationId, currentUser.uid);
    socket.emit('mark-messages-seen', {
      conversationId,
      userId: currentUser.uid
    });
  }
}, [socket, conversationId, currentUser?.uid]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8f8f8',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b font-semibold flex items-center justify-between"
        style={{
          borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          color: theme === 'dark' ? '#ff7300' : '#111827',
        }}
      >
        <div className="flex items-center gap-3">
  {otherUser.image ? (
    <img src={otherUser.image} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-300" />
  )}
  <span>{otherUser.name}</span>
</div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3">
        <div ref={messagesEndRef} />
        {[...messages].reverse().map((msg) => {
          const isMe = msg.sender === currentUser.uid;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs px-3 py-2 rounded-xl shadow-sm"
                style={{
                  backgroundColor: isMe
                    ? theme === 'dark'
                      ? '#ff7300'
                      : '#2563eb'
                    : theme === 'dark'
                      ? '#1f1f1f'
                      : '#ffffff',
                  color: isMe ? '#fff' : theme === 'dark' ? '#ededed' : '#111827',
                }}
              >
                <div>{msg.text}</div>
                <div className="text-xs mt-1 text-right opacity-70">
                  {formatTime(msg.createdAt)}
                  {msg.sender === currentUser.uid ? (
                    msg.seenBy?.includes(otherUserUid) ? " ✓✓" : " ✓"
                  ) : null}


                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div
        className="p-3 flex gap-2 border-t"
        style={{
          borderColor: theme === 'dark' ? '#333' : '#ddd',
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f0f0f0',
            color: theme === 'dark' ? '#fff' : '#111827',
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-sm rounded font-semibold"
          style={{
            backgroundColor: theme === 'dark' ? '#ff7300' : '#2563eb',
            color: '#fff',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
