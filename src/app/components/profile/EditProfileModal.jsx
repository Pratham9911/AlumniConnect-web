'use client';

import { useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { getCloudinarySignature, uploadImageToCloudinary } from '@/lib/cloudinary';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export default function EditProfileModal({ user, onClose }) {
  const [form, setForm] = useState({
    name: user.name || '',
    dob: user.dob || '',
    country: user.country || '',
    role: user.role || '',
    workplace: user.workplace || '',
    bio: user.bio || '',
    facebook: user.facebook || '',
    twitter: user.twitter || '',
    linkedin: user.linkedin || '',
    whatsapp: user.whatsapp || '',
    profileImageUrl: user.profileImageUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

 

const handleUpload = async (file) => {
  setLoading(true);

  try {
    // Compress image before upload
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.2,             // Max size ~200 KB
      maxWidthOrHeight: 600,      // Resize dimensions (e.g. 600px max)
      useWebWorker: true,
    });

    const folder = 'user_profiles';
    const publicId = `profile_${user.uid}`;
    const signature = await getCloudinarySignature(publicId, folder);
    const url = await uploadImageToCloudinary(compressedFile, folder, publicId, signature);

    setForm(prev => ({ ...prev, profileImageUrl: url }));
  } catch (error) {
    console.error('Image compression or upload failed:', error);
    toast.error('Image upload failed');
  } finally {
    setLoading(false);
  }
};


  const handleSave = async () => {
    const toastId = 'profile-toast';
    const { whatsapp, linkedin, facebook, twitter } = form;

    if (whatsapp && !/^[0-9]{10,15}$/.test(whatsapp)) {
      toast.error('Invalid WhatsApp number', { id: toastId });
      return;
    }

    let linkedinUrl = linkedin;
    if (linkedinUrl && !/^https?:\/\//.test(linkedinUrl)) {
      linkedinUrl = 'https://' + linkedinUrl;
    }
    if (linkedinUrl && !/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedinUrl)) {
      toast.error('Invalid LinkedIn URL', { id: toastId });
      return;
    }

    let facebookUrl = facebook;
    if (facebookUrl && !/^https?:\/\//.test(facebookUrl)) {
      facebookUrl = 'https://' + facebookUrl;
    }
    if (facebookUrl && !/^https:\/\/(www\.)?facebook\.com\/.*$/.test(facebookUrl)) {
      toast.error('Invalid Facebook URL', { id: toastId });
      return;
    }

    let twitterUrl = twitter;
    if (twitterUrl && !/^https?:\/\//.test(twitterUrl)) {
      twitterUrl = 'https://' + twitterUrl;
    }
    if (twitterUrl && !/^https:\/\/(www\.)?x\.com\/.*$/.test(twitterUrl)) {
      toast.error('Invalid Twitter URL', { id: toastId });
      return;
    }

    try {
      setLoading(true);
      toast.loading('Saving...', { id: toastId });

      await updateDoc(doc(db, 'users', user.uid), {
        ...form,
        linkedin: linkedinUrl,
        facebook: facebookUrl,
        twitter: twitterUrl,
      });

      toast.success('Profile updated successfully!', { id: toastId });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile', err);
      toast.error('Something went wrong', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center sm:p-0 p-4">
      <div
        className="relative w-full sm:max-w-2xl rounded-lg p-6 max-h-screen sm:max-h-[90vh] overflow-y-auto shadow-xl"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 hover:opacity-80 transition"
          onClick={onClose}
          title="Close"
          style={{ color: 'var(--foreground)' }}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-6">Edit Profile</h2>

        {/* Profile Picture Upload */}
        <div className="flex justify-center mb-4">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-2"
            style={{ borderColor: 'var(--button-border)' }}
          >
            <img
              src={form.profileImageUrl}
              alt="Profile"
              className="object-cover w-full h-full"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change Profile Picture"
            />
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid gap-4">
          {[
            { type: 'text', key: 'name', placeholder: 'Full Name' },
            { type: 'date', key: 'dob' },
            { type: 'text', key: 'country', placeholder: 'Country' },
            { type: 'text', key: 'role', placeholder: 'Role' },
            { type: 'text', key: 'workplace', placeholder: 'Workplace' },
            { type: 'textarea', key: 'bio', placeholder: 'Bio' },
            { type: 'url', key: 'linkedin', placeholder: 'LinkedIn' },
            { type: 'url', key: 'facebook', placeholder: 'Facebook' },
            { type: 'url', key: 'twitter', placeholder: 'Twitter' },
            { type: 'text', key: 'whatsapp', placeholder: 'WhatsApp (with country code)' },
          ].map(({ type, key, placeholder }) =>
            type === 'textarea' ? (
              <textarea
                key={key}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="px-3 py-2 rounded-md text-sm w-full"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--button-border)',
                  color: 'var(--foreground)',
                  borderWidth: '1px',
                }}
              />
            ) : (
              <input
                key={key}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="px-3 py-2 rounded-md text-sm w-full"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--button-border)',
                  color: 'var(--foreground)',
                  borderWidth: '1px',
                }}
              />
            )
          )}

          <button
            onClick={handleSave}
            className="py-2 rounded-md font-semibold mt-4 flex justify-center items-center gap-2 transition-colors"
            style={{
              backgroundColor:  'var(--primary)',
              
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
