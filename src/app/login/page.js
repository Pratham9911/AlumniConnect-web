'use client';

import React , { useState } from 'react';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile
} from 'firebase/auth';


//Sign-In Logic

import{
  doc, getDoc , setDoc
} from 'firebase/firestore';

import { db } from '../firebase/config';

// User Schema
const defaultUserData = (user , nameFallback="") => ({
  uid : user.uid,
    name: user.displayName || nameFallback,
  email: user.email,
  dob: "",
  country: "",
  role: "",
  workplace: "",
  bio: "Hey there, I'm using AlumniConnect!",
  profileImageUrl: user.photoURL || "",
  facebook: "",
  twitter: "",
  linkedin: "",
  whatsapp: "",
})

const  saveUserIfNew = async (user,name="" )=> {
  const ref = doc(db , 'users' , user.uid);
  const snap = await getDoc(ref);
   if (!snap.exists()) {
    const data = defaultUserData(user, name);
    await setDoc(ref, data);
    console.log('✅ User profile created in Firestore');
  } 
}



export default function LoginPage()
{

  const router = useRouter();
   const [loading , setLoading] = useState(false);
   const [activeTab , setActiveTab] = useState('login');
   const [email , setemail] = useState('');
   const [password , setPassword] = useState('');
   const [name, setName] = useState('');



  //google sign in function and github sign in function
  const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;
    await saveUserIfNew(user, user.displayName || '');
   
    router.replace('/dashboard'); // ✅ redirect
  } catch (e) {
    alert('Google login failed. Please try again.');
    setLoading(false);
  }
};

const handleGitHubSignIn = async () => {
  try {
    setLoading(true);
    const result = await signInWithPopup(auth, new GithubAuthProvider());
    const user = result.user;
    await saveUserIfNew(user)
    router.replace('/dashboard');
  } catch (err) {
    alert(err.message);
    setLoading(false);
  }
};
   //this function will login or register the user based on the active tab
   const handleEmailAuth = async () => {
    try{
       setLoading(true);
        if(activeTab === 'login') {
           await signInWithEmailAndPassword(auth , email , password);
          router.replace('/dashboard');
        }
        else{
            const userCredential = await createUserWithEmailAndPassword(auth , email , password);
           const user = userCredential.user;
           await updateProfile(user, { displayName: name})
           await saveUserIfNew(user, name);
          router.replace('/dashboard');
        }

    }
    catch(e){
       alert(e.message);
       setLoading(false);
    }
   }

  return (
     <div className='min-h-screen flex flex-col bg-white text-black font-sans'>
    
    {/*Upper Navbar icon for AlumniConnect */}
     <header className='flex items-center justify-between border-b border-[#f3f0f4] px-6 sm:px-10 py-3'>
          <div className="flex items-center gap-4">
          <div className="w-5 h-5">

            {/* AlumniConnect Icon */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold">AlumniConnect</h2>
        </div>
     </header>
 {loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
  </div>
)}


     <main className='flex flex-1 justify-center items-center px-4 py-8'>

      <div className='w-full max-w-lg'>
         <h2 className='text-3xl font-bold mb-6 text-center'>
          Welcome Back
         </h2>

        <div className='flex border-b border-border-[#e3dbe6] mb-6'>
         {/* button switch for login and register */}
          <button
             onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 font-bold text-sm border-b-2 ${
                activeTab === 'login'? 'text-[#161118] border-[#161118]' : 'text-[#7f6189] border-transparent'
              }`}
             >
              Login
             </button>

             <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 font-bold text-sm border-b-2 ${
                activeTab === 'register'? 'text-[#161118] border-[#161118]' : 'text-[#7f6189] border-transparent'
              }`}
              >
              Register
              </button>
        </div>

        {/*form for login or registration */}
      
      <form
       onSubmit={(e) => {
         e.preventDefault();
         handleEmailAuth();
       }}

       className='space-y-4'
       >
        {activeTab ==='register'&&(
          <div>
            <label className='block text-base font-medium mb-2'>Name</label>
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => 
                setName(e.target.value)
              }
              className="w-full h-12 px-4 rounded-xl border border-[#e3dbe6] placeholder:text-[#7f6189] "
              required
              />
             
          </div>
        )}

        <div>
          <label className='block text-base font-medium mb-2'>
            Email
          </label>

          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => {
              setemail(e.target.value)
            }}
            className='w-full h-12 px-4 rounded-xl border border-[#e3dbe6] placeholder:text-[#7f6189]'
            required
          />
        </div>
   <div>
              <label className="block text-base font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#e3dbe6] placeholder:text-[#7f6189] focus:outline-none"
                required
              />
            </div>
   <div className='text-sm text-[#7f6189] underline'>Forgot password</div>

    <button
      type='submit'
      className='w-full h-12 bg-[#b513eb] text-white font-bold rounded-xl mt-2'
      >
        {activeTab === 'login'? 'Login':'Register'}
      </button>
       </form>

         <p className="text-center text-sm text-[#7f6189] mt-6">Or continue with</p>
        <div 
        className='flex flex-col sm:flex-row gap-3 mt-3'>
          <button
          onClick={() => {
           handleGoogleLogin();
            
          }}
          className = 'w-full h-10 bg-[#f3f0f4] rounded-xl font-bold text-sm'
       >
         Continue with Google 
       </button>

        <button
              onClick={() =>  handleGitHubSignIn()}
              className="w-full h-10 bg-[#f3f0f4] rounded-xl font-bold text-sm"
            >
              Continue with GitHub
            </button>
        </div>

      </div>
     </main>

     </div>
  )

};



