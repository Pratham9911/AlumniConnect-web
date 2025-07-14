'use client';

import { useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { getCloudinarySignature, uploadImageToCloudinary } from '@/lib/cloudinary';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';


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
        const folder = 'user_profiles';
        const publicId = `profile_${user.uid}`;
        const signature = await getCloudinarySignature(publicId, folder);
        const url = await uploadImageToCloudinary(file, folder, publicId, signature);
        setForm(prev => ({ ...prev, profileImageUrl: url }));
        setLoading(false);
    };

 const handleSave = async () => {
  const toastId = 'profile-toast';
  const { whatsapp, linkedin, facebook, twitter } = form;

  // Validation
  if (whatsapp && !/^[0-9]{10,15}$/.test(whatsapp)) {
    toast.error('Invalid WhatsApp number', { id: toastId });
    return;
  }

  let linkedinUrl = linkedin;
  if (linkedinUrl) {
    if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
      linkedinUrl = 'https://' + linkedinUrl;
    }
    if (!/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedinUrl)) {
      toast.error('Invalid LinkedIn URL', { id: toastId });
      return;
    }
  }

  let facebookUrl = facebook;
  if (facebookUrl) {
    if (!facebookUrl.startsWith('http://') && !facebookUrl.startsWith('https://')) {
      facebookUrl = 'https://' + facebookUrl;
    }
    if (!/^https:\/\/(www\.)?facebook\.com\/.*$/.test(facebookUrl)) {
      toast.error('Invalid Facebook URL', { id: toastId });
      return;
    }
  }

  let twitterUrl = twitter;
  if (twitterUrl) {
    if (!twitterUrl.startsWith('http://') && !twitterUrl.startsWith('https://')) {
      twitterUrl = 'https://' + twitterUrl;
    }
    if (!/^https:\/\/(www\.)?x\.com\/.*$/.test(twitterUrl)) {
      toast.error('Invalid Twitter URL', { id: toastId });
      return;
    }
  }

  try {
    setLoading(true);
    toast.loading('Saving...', { id: toastId });

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
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
            <div className="relative bg-white w-full sm:max-w-2xl rounded-lg p-6 max-h-screen sm:max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                    title="Close"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-black text-xl font-semibold text-center mb-6">Edit Profile</h2>

                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
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
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="date"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.dob}
                        onChange={e => setForm({ ...form, dob: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Workplace"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.workplace}
                        onChange={e => setForm({ ...form, workplace: e.target.value })}
                    />
                    <textarea
                        placeholder="Bio"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.bio}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="LinkedIn"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.linkedin}
                        onChange={e => setForm({ ...form, linkedin: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="Facebook"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.facebook}
                        onChange={e => setForm({ ...form, facebook: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="Twitter"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.twitter}
                        onChange={e => setForm({ ...form, twitter: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="WhatsApp (with country code)"
                        className="text-black border border-black px-3 py-2 rounded-md text-sm w-full"
                        value={form.whatsapp}
                        onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                    />

                    {/* Save Button */}
                   <button
  onClick={handleSave}
  className="bg-blue-600 text-white py-2 rounded-md font-semibold mt-4 hover:bg-blue-700 flex justify-center items-center gap-2"
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
