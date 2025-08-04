import axios from 'axios';
import { useRouter } from 'next/navigation';

export const startConversation = async ({ senderId, receiverId, router }) => {
  try {
    // Send request to backend to create/get conversation
    const res = await axios.post('http://localhost:5000/api/conversations', {
      senderId,
      receiverId,
    });

    // Redirect to the conversation page
    if (res.data && res.data._id) {
      router.push(`/chat/${receiverId}`);
    }
  } catch (err) {
    console.error('Error starting conversation:', err.message);
    alert( err.message);
  }
};
