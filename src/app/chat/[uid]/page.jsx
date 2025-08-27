'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/firebase/config';
import { io } from 'socket.io-client';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { ArrowLeft, Trash2 } from "lucide-react";
import Navbar from '@/app/components/Navbar';

export default function ChatWithUser() {
  const { uid: otherUserUid } = useParams(); // UID of the user you're chatting with
  const { currentUser, theme } = useAuth();
  const socketRef = useRef(null);
  const router = useRouter();

  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const isSelectionMode = selectedMessageIds.length > 0;
  const [otherUser, setOtherUser] = useState({ name: '', image: null });
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ 1. Setup socket once
  useEffect(() => {

    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_BASE}`);
    return () => socketRef.current.disconnect();
  }, []);

  // ✅ 2. Re-join conversation on connect + mount
  useEffect(() => {
    const socket = socketRef.current;
    if (!conversationId || !socket) return;

    const handleJoin = () => {
      console.log("📡 Rejoining room:", conversationId);
      socket.emit('join-conversation', conversationId);
    };

    socket.on('connect', handleJoin);
    handleJoin();

    return () => socket.off('connect', handleJoin);
  }, [conversationId]);

  // ✅ 3. Setup conversation and fetch messages
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

        socketRef.current.emit('join-conversation', convo._id);

        const msgRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${convo._id}?limit=50&uid=${currentUser.uid}`
        );


        setMessages(msgRes.data.filter(m => !m.deletedBy?.includes(currentUser.uid)));


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

  // ✅ 4. Receive new message
  useEffect(() => {
    const socket = socketRef.current;
    socket.on('receive-message', (newMsg) => {
      if (!newMsg.deletedBy?.includes(currentUser?.uid)) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });


    return () => socket.off('receive-message');
  }, []);

  // ✅ 5. Mark messages as seen
  useEffect(() => {
    const socket = socketRef.current;

    if (!conversationId || !currentUser?.uid || !socket) return;

    // Only emit mark seen AFTER joining room
    const timeout = setTimeout(() => {
      console.log('📤 Emitting mark-messages-seen:', conversationId, currentUser.uid);
      socket.emit('mark-messages-seen', {
        conversationId,
        userId: currentUser.uid,
      });
    }, 500); // delay to ensure room is joined

    return () => clearTimeout(timeout);
  }, [conversationId, currentUser?.uid]);

  // ✅ 6. Update seenBy in real-time
  useEffect(() => {
    const socket = socketRef.current;
    socket.on('messages-seen-update', ({ conversationId: updatedId, seenBy }) => {
      if (updatedId === conversationId) {
        console.log("📥 Received messages-seen-update:", updatedId, seenBy);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (!msg.seenBy?.includes(seenBy)) {
              console.log("👀 Updating seenBy in msg:", msg.text);
              return {
                ...msg,
                seenBy: [...(msg.seenBy || []), seenBy],
              };
            }
            return msg;
          })
        );
      }
    });

    return () => socket.off('messages-seen-update');
  }, [conversationId]);
  const socket = socketRef.current;
  useEffect(() => {

    if (!socket) return;

    // when message is deleted for everyone
    socket.on("message-removed", ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    // when message is deleted for me only
    socket.on("message-deleted", ({ messageId, type }) => {
      if (type === "me") {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      }
    });

    return () => {
      socket.off("message-removed");
      socket.off("message-deleted");
    };
  }, [socket]);


  const handleMessageSelect = (e, messageId) => {
    e.preventDefault(); // prevents default right click menu on desktop

    setSelectedMessageIds((prev) => {
      if (!prev) prev = [];
      return prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    })
  };


  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !conversationId) return;

    const msgData = {
      conversationId,
      sender: currentUser.uid,
      text,
    };

    socketRef.current.emit('send-message', msgData);
    setText('');
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleDelete = async (type) => {
    if (!selectedMessageIds.length) return;
    try {
      for (let id of selectedMessageIds) {
        socketRef.current.emit("delete-message", {
          messageId: id,
          userId: currentUser.uid, // your logged in uid
          type, // "me" or "everyone"
        });
      }

      // local update
      if (type === "me") {
        setMessages((prev) =>
          prev.filter((msg) => !selectedMessageIds.includes(msg._id))
        );
      } else if (type === "everyone") {
        setMessages((prev) =>
          prev.filter((msg) => !selectedMessageIds.includes(msg._id))
        );
      }

      setSelectedMessageIds([]);
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // Assuming you already have messages[] in state containing all messages
  const allMine = selectedMessageIds.every(
    (id) => {
      const msg = messages.find(m => m._id === id);   // find message by ID
      return msg && msg.senderId === currentUser.uid; // check ownership
    }
  );

  const longPressTimeout = useRef(null);

  const handleTouchStart = (msgId) => {
    longPressTimeout.current = setTimeout(() => {
      handleMessageSelect(null, msgId); // triggers selection
    }, 1500); // 1.5 seconds
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
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

      <div className="hidden md:block w-full h-14 sticky mb-0 z-50 ">
        <Navbar />
      </div>

      <div
        className="p-4  border-b font-semibold flex items-center justify-between"
        style={{
          borderColor: theme === "dark" ? "#333" : "#e0e0e0",
          backgroundColor: theme === "dark" ? "#000" : "#fff",
          color: theme === "dark" ? "#ff7300" : "#111827",
        }}
      >
        {selectedMessageIds.length > 0 ? (

          <>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedMessageIds([])}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <span>{selectedMessageIds.length} selected</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteDialog(true)}>

                <Trash2 className="w-6 h-6 text-red-500" />
              </button>
            </div>
          </>
        ) : (

          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/chat')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            {otherUser.image ? (
              <img
                src={otherUser.image}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}
            <span>{otherUser.name}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3">
        <div ref={messagesEndRef} />
        {[...messages].reverse().map((msg) => {
          const isMe = msg.sender === currentUser.uid;
          const isSelected = selectedMessageIds?.includes(msg._id); // safe check

          return (
            <div
              key={msg._id}
              onContextMenu={(e) => handleMessageSelect(e, msg._id)} // right-click desktop
              onTouchStart={() => handleTouchStart(msg._id)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
              className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSelected ? "bg-green-200/40" : ""
                } rounded-lg`}
            >
              <div
                className="max-w-xs px-3 py-2 rounded-xl shadow-sm "

                style={{
                  backgroundColor: isSelected
                    ? "rgba(134, 239, 172, 0.4)"
                    : isMe
                      ? theme === "dark"
                        ? "#ff7300"
                        : "#2563eb"
                      : theme === "dark"
                        ? "#1f1f1f"
                        : "#ffffff",
                  color: isSelected
                    ? "#111827"
                    : isMe
                      ? "#fff"
                      : theme === "dark"
                        ? "#ededed"
                        : "#111827",
                }}
              >

                <div>{msg.text}</div>
                <div className="text-xs mt-1 text-right opacity-70">
                  {formatTime(msg.createdAt)}
                  {msg.sender === currentUser.uid
                    ? msg.seenBy?.includes(otherUserUid)
                      ? " ✓✓"
                      : " ✓"
                    : null}
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
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-lg p-6 w-72 animate-scaleIn">
            <h3 className="font-semibold text-lg text-center mb-4">
              Delete {selectedMessageIds.length > 1 ? "messages" : "message"}?
            </h3>

            {/* Always show delete for me */}
            <button
              onClick={() => handleDelete("me")}
              className="w-full py-2 mb-2 border rounded-lg bg-gray-200 hover:bg-red-400 text-black hover:text-white transition"
            >
              Delete for Me
            </button>

            {/* Only show delete for everyone if ALL selected are mine */}
            {selectedMessageIds.every(
              (id) => messages.find(m => m._id === id)?.sender === currentUser.uid
            ) && (
                <button
                  onClick={() => handleDelete("everyone")}
                  className="w-full py-2 mb-2 rounded-lg border bg-gray-200 hover:bg-red-400 text-black hover:text-white 0 transition"
                >
                  Delete for Everyone
                </button>
              )}

            <button
              onClick={() => setShowDeleteDialog(false)}
              className="w-full py-2 mt-1 rounded-lg border hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}


    </div>

  );
}
