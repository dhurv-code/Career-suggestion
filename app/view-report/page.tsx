"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function ViewReportPage() {
  const [report, setReport] = useState("");
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("No report ID found in URL");
    setLoading(false);
    return;
  }

  async function load() {
    const snap = await getDoc(doc(db, "reports", String(id))); 

    if (snap.exists()) {
      const data = snap.data();
      setReport(data.report);
      setCareers(data.careers || []);
    } else {
      console.error("Report not found");
    }

    setLoading(false);
  }

  load();
}, []);



  if (loading) return <p className="text-white p-6">Loading report...</p>;

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-[#9333ea] opacity-20 blur-[160px] -top-40 -left-32"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#06b6d4] opacity-20 blur-[150px] bottom-10 right-0"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#f472b6] opacity-10 blur-[130px] top-1/2 left-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative bg-gradient-to-r from-[#6d28d9] to-[#0ea5e9] p-10 shadow-xl">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
          CareerAI — Detailed Career Report
        </h1>
        <p className="text-sm text-white/80 mt-2">
          Personalized insights based on your chosen career paths
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto mt-10 mb-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-xl font-semibold mb-3">Selected Careers</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {careers.map((c: string, i: number) => (
            <span
              key={i}
              className="px-4 py-1 rounded-full text-sm bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() =>
              window.open(
                `/api/download-pdf?id=${new URLSearchParams(window.location.search).get("id")}`
              )
            }
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium"
          >
            Download PDF
          </button>

          <Link
            href="/dashboard"
            className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="prose prose-invert max-w-none leading-relaxed text-[15px]">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
