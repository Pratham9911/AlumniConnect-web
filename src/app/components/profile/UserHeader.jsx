'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaLinkedinIn, FaFacebookF, FaTwitter, FaPen } from 'react-icons/fa';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { getCloudinarySignature } from '@/lib/cloudinary';
import EditProfileModal from '@/app/components/profile/EditProfileModal';
import { useTheme } from '@/app/context/ThemeContext';

export default function UserHeader({ user, isOwner }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { theme } = useTheme();

  const handleImageUpload = async (type, file) => {
    try {
      setUpdating(true);
      const folder = type === 'profile' ? 'user_profiles' : 'user_backgrounds';
      const publicId = `${type}_${user.uid}`;
      const signaturePayload = await getCloudinarySignature(publicId, folder);
      const imageUrl = await uploadImageToCloudinary(file, folder, publicId, signaturePayload);
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
        {user.backgroundImageUrl && (
          <Image src={user.backgroundImageUrl} fill alt="Background" className="object-cover" />
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
          {user.profileImageUrl && (
            <Image src={user.profileImageUrl} alt="Profile" fill className="object-cover" />
          )}
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
              <span className="font-semibold">1,234</span> followers · <span className="font-semibold">500+</span> connections
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="px-5 py-2 rounded-md text-sm font-bold shadow transition"
              style={{
                backgroundColor: theme === 'dark' ? '#ff7300' : '#3b82f6',
                color: theme==='dark' ? '#000000' : '#ffffff',
              }}
            >
              Connect
            </button>
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
