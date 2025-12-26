"use client";

import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import Link from "next/link";




export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  

  return (
    <nav className="w-full bg-slate-900 text-white p-4 flex justify-between items-center">
      
      <Link href="/" className="text-xl font-bold">
        CareerAI
      </Link>


      <div className="flex items-center space-x-6">

      
        <Link href="/" className="text-sm hover:text-indigo-300">
          Home
        </Link>

        <Link href="/test" className="text-sm hover:text-indigo-300">
          Test
        </Link>

        <Link href="/pricing" className="text-sm hover:text-indigo-300">
          Pricing
        </Link>

       
        {user && (
          <Link
            href="/dashboard"
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-500 text-sm"
          >
            Dashboard
          </Link>
        )}

      
        {user ? (
          <>
            <span className="text-sm opacity-80">{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 px-3 py-2 rounded hover:bg-red-500 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
