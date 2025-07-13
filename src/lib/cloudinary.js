// lib/cloudinary.js

/**
 * Uploads an image to Cloudinary using signed upload
 * Requires: timestamp, public_id, signature, api_key (from server)
 */

export async function uploadImageToCloudinary(file, folder, publicId, signaturePayload) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'alumni_signed');
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('timestamp', signaturePayload.timestamp);
  formData.append('api_key', signaturePayload.apiKey);
  formData.append('signature', signaturePayload.signature);

  const res = await fetch('https://api.cloudinary.com/v1_1/dvt0ac7op/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url; // URL to store in Firestore
}

/**
 * Gets a signed upload payload from your Firebase function
 * @returns { timestamp, signature, apiKey }
 */
export async function getCloudinarySignature(publicId, folder) {
  const res = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, folder })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch signature');
  return data;
}
