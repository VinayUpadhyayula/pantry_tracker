'use client'
import React, { useEffect, useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup,signOut} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from './authcontext';
import { UserIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user} = useAuth();
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push('/pantry');
    }
  }, [user, router]);
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user.displayName);
      // Successfully signed in
      router.push('/pantry');
    } catch (error) {
      // Handle Errors here.
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="PantryGuru Logo" 
            className="object-cover w-48 h-auto"
          />
          <h1 className="text-white text-3xl font-bold mt-4">Welcome to PantryGuru</h1>
        </div>
        
        {/* Form Card Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <p className="text-black text-center mb-6">Please sign in to access your pantry tracker.</p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mx-auto"
          >
            <UserIcon className="mr-2 h-6 w-6" />
            Sign in with Google
          </button>
        </div>
      </div>
      </div>
  );
};

export default HomePage;
