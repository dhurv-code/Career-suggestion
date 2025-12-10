"use client";

import Link from "next/link";
import NeonBackground from "./components/NeonBackground";

export default function HomePage() {
  return (
    <NeonBackground>
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">

        {/* HERO SECTION */}
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Career-Path AI
        </h1>

        <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed mb-8">
          Confused between Software Engineering, Government Jobs, Data Science,
          Web-development, Artificial Intelligence, Medical & Healthcare, Teaching,
          Business Entrepreneurship and many more?  
          <br />
          <span className="text-indigo-300 font-semibold">
            Let AI discover the best career path built for your mind & personality.
          </span>
        </p>

        <Link
          href="/test"
          className="bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg text-white px-8 py-3 rounded-xl font-semibold"
        >
          Start Career Test
        </Link>

      </main>
    </NeonBackground>
  );
}
