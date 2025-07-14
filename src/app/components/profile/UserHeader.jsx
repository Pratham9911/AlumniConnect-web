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


export default function UserHeader({ user, isOwner }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleImageUpload = async (type, file) => {
    try {
      setUpdating(true);

      const folder = type === 'profile' ? 'user_profiles' : 'user_backgrounds';
      const publicId = `${type}_${user.uid}`;

      // ✅ Get signed upload parameters from backend
      const signaturePayload = await getCloudinarySignature(publicId, folder);

      // ✅ Upload to Cloudinary using signed params
      const imageUrl = await uploadImageToCloudinary(
        file,
        folder,
        publicId,
        signaturePayload
      );

      // ✅ Update Firestore with the new image URL
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
    <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 relative">



      {/* Background */}
      <div className="relative h-48 bg-gradient-to-br from-pink-200 to-white group">
        {user.backgroundImageUrl && (
          <Image
            src={user.backgroundImageUrl}
            fill
            alt="Background"
            className="object-cover"
          />
        )}

        {isOwner && (
          <>
            <button
              onClick={() => bgInputRef.current.click()}
              className="absolute top-3 right-3 opacity-100 md:opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/70  text-white p-2 rounded-full z-10" title="Edit background"
            >
              <FaPen size={14} />
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

      {/* Profile image (floating) */}
      <div className="relative px-6">
        <div className="absolute -top-14 sm:-top-16 left-6 sm:left-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden z-20 group ">

          {user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          )}
          {isOwner && (
            <>
              <button
                onClick={() => setShowEdit(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Edit profile picture"
              >
                <FaPen size={12} />
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

      {/* Info section (below background) */}
      <div className="mt-20 sm:mt-24 px-6 sm:px-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-700 text-sm mt-1">{user.role}</p>
            <p className="text-gray-600 text-sm">{user.workplace}</p>
            <p className="text-gray-500 text-sm">{user.country}</p>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-semibold">1,234</span> followers · <span className="font-semibold">500+</span> connections
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow">
              Connect
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-900">About</h3>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            {user.bio || 'No bio added yet.'}
          </p>
        </div>

        {/* Connect Icons */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Connect</h3>
          <div className="flex flex-wrap gap-3">
            {user.whatsapp && (
              <a
                href={`https://wa.me/${user.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium"
              >
                <FaLinkedinIn />
                LinkedIn
              </a>
            )}
            {user.facebook && (
              <a
                href={user.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium"
              >
                <FaFacebookF />
                Facebook
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium"
              >
                <FaTwitter />
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Add Section */}
        {isOwner && (
          <div className="mt-8">
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-all">
              Add Section
            </button>
          </div>
        )}
      </div>
      {showEdit && <EditProfileModal user={user} onClose={() => setShowEdit(false)} />}

    </div>
  );
}
