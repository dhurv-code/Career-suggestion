"use client";

import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: any) {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <p className="bg-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 p-3 rounded hover:bg-blue-500"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-green-400">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
