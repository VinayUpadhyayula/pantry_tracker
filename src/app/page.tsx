'use client'
import React, { useEffect } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup,signOut} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from './authcontext';
import { UserIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user} = useAuth();

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
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 via-green-300 to-green-400">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/logo.png')" }}></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center z-10">
        <h1 className="text-black text-3xl font-bold mb-4">Welcome to PantryGuru</h1>
        <p className="text-black mb-6">Please sign in to access your pantry tracker.</p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mx-auto"
        >
          <UserIcon className="mr-2 h-6 w-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default HomePage;
