'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/firebase/config';
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaTwitter, FaPen } from 'react-icons/fa';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { doc,  onSnapshot, updateDoc, getDoc, setDoc, serverTimestamp, arrayUnion ,   deleteDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { getCloudinarySignature } from '@/lib/cloudinary';
import EditProfileModal from '@/app/components/profile/EditProfileModal';
import { useTheme } from '@/app/context/ThemeContext';
import { Clock, MessageCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function UserHeader({ user, isOwner }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  //Storing the user connection request
  const [requestStatus, setRequestStatus] = useState(''); // 'pending', 'accepted', 'rejected'

  const handleImageUpload = async (type, file) => {
    try {
      setUpdating(true);

      // ✅ Compress the image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1,              // Try to keep under 200 KB
        maxWidthOrHeight: 600,       // Resize large images (600px max)
        useWebWorker: true,
      });

      const folder = type === 'profile' ? 'user_profiles' : 'user_backgrounds';
      const publicId = `${type}_${user.uid}`;
      const signaturePayload = await getCloudinarySignature(publicId, folder);
      const imageUrl = await uploadImageToCloudinary(compressedFile, folder, publicId, signaturePayload);

      await updateDoc(doc(db, 'users', user.uid), {
        [`${type}ImageUrl`]: imageUrl,
      });

      window.location.reload();
    } catch (err) {
      console.error('Image update failed', err);
    } finally {
      setUpdating(false);
    }
  };

//to check if B has Deleted A from Friends
const cleanupDisconnectedFriends = async () => {
  const myUid = currentUser.uid;

  const mySnap = await getDoc(doc(db, 'users', myUid));
  const myConnections = mySnap.data()?.connections || [];

  for (const friendUid of myConnections) {
    const friendSnap = await getDoc(doc(db, 'users', friendUid));
    const friendConnections = friendSnap.data()?.connections || [];

    // If my UID is missing from their connections → remove them from mine
    if (!friendConnections.includes(myUid)) {
      await updateDoc(doc(db, 'users', myUid), {
        connections: arrayRemove(friendUid),
      });
      console.log(`Removed stale connection: ${friendUid}`);
    }
  }
};


// In UserHeader.jsx:
const checkIfBAlreadyAccepted = async () => {
  const senderUid = currentUser.uid;
  const receiverUid = user.uid;

  const receiverSnap = await getDoc(doc(db, 'users', receiverUid));
  const receiverConnections = receiverSnap.data()?.connections || [];

  if (receiverConnections.includes(senderUid)) {
    // B accepted → A adds B
    const senderRef = doc(db, 'users', senderUid);
    const senderSnap = await getDoc(senderRef);
    const myConnections = senderSnap.data()?.connections || [];
    setRequestStatus('connected');
    if (!myConnections.includes(receiverUid)) {
      await updateDoc(senderRef, {
        connections: [...myConnections, receiverUid],
      });
    }

    // Remove request
    await deleteDoc(
      doc(db, 'connectionRequests', receiverUid, 'requests', `from_${senderUid}`)
    );

    // Remove from pendingConnections (optional)
    await updateDoc(senderRef, {
      pendingConnections: arrayRemove(receiverUid),
    });
  }
};


useEffect(() => {
  if (!currentUser || !user?.uid || currentUser.uid === user.uid) return;

  const senderUid = currentUser.uid;
  const receiverUid = user.uid;

  const unsubscribe = onSnapshot(doc(db, 'users', senderUid), async (docSnap) => {
    const myConnections = docSnap.data()?.connections || [];

    cleanupDisconnectedFriends();
    // ✅ Already connected
    if (myConnections.includes(receiverUid)) {
      setRequestStatus('connected');
      return;
    }
    await checkIfBAlreadyAccepted ();

    // 🔍 If not connected, check if request is still pending
    try {
      const reqDoc = await getDoc(
        doc(db, 'connectionRequests', receiverUid, 'requests', `from_${senderUid}`)
      );

      if (reqDoc.exists()) {
        setRequestStatus('pending');
      } else {
        setRequestStatus('');
      }
    } catch (err) {
      console.error('Error checking request status:', err);
      setRequestStatus('');
    }
  });

  return () => unsubscribe();
}, [currentUser?.uid, user?.uid]);

  const handleConnect = async () => {
    try {
      const senderUid = currentUser.uid;
      const receiverUid = user.uid;

      if (!senderUid || !receiverUid || senderUid === receiverUid) return;

      // 1. Create connection request in receiver's request collection
      const requestRef = doc(
        db,
        'connectionRequests',
        receiverUid,
        'requests',
        `from_${senderUid}`
      );

      await setDoc(requestRef, {
        senderUid,
        timestamp: serverTimestamp(),
      });

      // 2. Update sender's pendingConnections array
      const senderRef = doc(db, 'users', senderUid);
      await updateDoc(senderRef, {
        pendingConnections: arrayUnion(receiverUid),
      });

      setRequestStatus('pending');
      console.log(`Connection request sent from ${senderUid} to ${receiverUid}`);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };




  return (
    <div
      className="w-full shadow-sm rounded-lg overflow-hidden border relative"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        borderColor: 'var(--search-bg)',
      }}
    >
      {/* Background */}
      <div className="relative h-48 group">
        {user.backgroundImageUrl ? (
          <Image
            src={user.backgroundImageUrl}
            fill
            alt="Background"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-[#1e293b] flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white opacity-80">
              {user.name || 'User'}
            </h2>
          </div>
        )}

        {isOwner && (
          <>
            <button
              onClick={() => bgInputRef.current.click()}
              className="absolute top-3 right-3 opacity-100 md:opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/70 text-white p-2 rounded-full z-10"
              title="Edit background"
            >
              <FaPen size={14} style={{ color: theme === 'dark' ? '#ff7300' : undefined }} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={bgInputRef}
              onChange={(e) => handleImageUpload('background', e.target.files[0])}
              className="hidden"
            />
          </>
        )}
      </div>


      {/* Profile Image */}
      <div className="relative px-6">
        <div className="absolute -top-14 sm:-top-16 left-6 sm:left-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden z-20 group">
          {user.profileImageUrl || user.photoURL ? (
            <Image
              src={user.profileImageUrl || user.photoURL}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-[#1e293b] flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white opacity-80">
              {user.name[0] || ' '}
            </h2>
          </div>}

          {isOwner && (
            <>
              <button
                onClick={() => setShowEdit(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Edit profile picture"
              >
                <FaPen size={12} style={{ color: theme === 'dark' ? '#ff7300' : undefined }} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload('profile', e.target.files[0])}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>


      {/* Info */}
      <div className="mt-20 sm:mt-24 px-6 sm:px-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold" >{user.name}</h2>
            <p className="text-sm mt-1">{user.role}</p>
            <p className="text-sm" >{user.workplace}</p>
            <p className="text-sm" >{user.country}</p>
           <p className="text-sm mt-1">
  <span className="font-semibold">{user?.connections?.length || 0}</span> connections
</p>

          </div>

          <div className="mt-4 sm:mt-0">
            {isOwner ? null : requestStatus === 'connected' ? (
              <button
                className="px-5 py-2 rounded-md text-sm font-bold shadow transition flex items-center gap-2"
                style={{
                  backgroundColor: theme === 'dark' ? '#22c55e' : '#4ade80',
                  color: theme === 'dark' ? '#000000' : '#ffffff',
                }}
              >
                <MessageCircle size={16} /> Message
              </button>
            ) : requestStatus === 'pending' ? (
              <button
                disabled
                className="px-5 py-2 rounded-md text-sm font-bold shadow transition flex items-center gap-2 opacity-70 cursor-not-allowed"
                style={{
                  backgroundColor: theme === 'dark' ? '#ff7300' : '#eab308',
                  color: theme === 'dark' ? '#000000' : '#ffffff',
                }}
              >
                <Clock size={16} className="animate-pulse" /> Pending
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="px-5 py-2 rounded-md text-sm font-bold shadow transition"
                style={{
                  backgroundColor: theme === 'dark' ? '#ff7300' : '#3b82f6',
                  color: theme === 'dark' ? '#000000' : '#ffffff',
                }}
              >
                Connect
              </button>
            )}
          </div>



        </div>

        {/* About */}
        <div className="mt-8">
          <h3 className="text-md font-semibold" >About</h3>
          <p className="text-sm mt-2 leading-relaxed" >
            {user.bio || 'No bio added yet.'}
          </p>
        </div>

        {/* Connect Icons */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Connect</h3>
          <div className="flex flex-wrap gap-3">
            {[{ icon: FaWhatsapp, label: 'WhatsApp', href: user.whatsapp ? `https://wa.me/${user.whatsapp}` : null },
            { icon: FaLinkedinIn, label: 'LinkedIn', href: user.linkedin },
            { icon: FaFacebookF, label: 'Facebook', href: user.facebook },
            { icon: FaTwitter, label: 'Twitter', href: user.twitter }]
              .filter(item => item.href)
              .map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded-md text-sm font-medium transition"

                  style={{
                    backgroundColor: theme === 'dark' ? '' : '#eff6ff',
                    borderColor: theme === 'dark' ? '#ff7300' : '#eff6ff',
                    color: theme === 'dark' ? '#ff7300' : '#1d4ed8',
                  }}

                  onMouseEnter={(e) => {
                    if (theme === 'dark') e.currentTarget.style.color = '#ffa94d';
                    else e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    if (theme === 'dark') e.currentTarget.style.color = '#ff7300';
                    else e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                >
                  <Icon />
                  {label}
                </a>
              ))}
          </div>
        </div>
      </div>

      {showEdit && <EditProfileModal user={user} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
