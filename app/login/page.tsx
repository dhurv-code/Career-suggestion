"use client";
import NeonBackground from "../components/NeonBackground";
import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <NeonBackground>
    <main className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <p className="bg-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 p-3 rounded hover:bg-green-500"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400">Sign up</a>
        </p>
      </div>
    </main>
    </NeonBackground>
  );
}
