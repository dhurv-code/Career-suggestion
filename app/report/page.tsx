"use client";

import AuthGuard from "../components/AuthGuard";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";

import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function DetailedReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);

  const reportRef = useRef(null);

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const careersParam = params.get("careers");

      if (careersParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(careersParam));
          if (Array.isArray(parsed)) setSelectedCareers(parsed);
        } catch (e) {
          console.error("Invalid careers data in URL", e);
        }
      }
    }
  }, []);


  async function generateReport() {
    if (selectedCareers.length === 0) {
      alert("No careers received. Please go back and take the test again.");
      return;
    }

    setLoading(true);
    setReport("");

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careers: selectedCareers, 
          context: "user test results",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.content) {
        alert("Error generating report.");
        setLoading(false);
        return;
      }

      setReport(data.content);


      const user = auth.currentUser;

      if (user) {
        try {
          await addDoc(collection(db, "reports"), {
            uid: user.uid,
            careers: selectedCareers,
            report: data.content,
            timestamp: new Date(),
          });
          console.log("Report saved successfully!");
        } catch (err: any) {
          console.error("Failed saving to Firestore →", err);
          alert("Could not save report: " + (err.message || "unknown error"));
        }
      }

    } catch (err: any) {
      console.error("SERVER ERROR →", err);
      alert("Server error: " + (err.message || "unknown error"));
    }

    setLoading(false);
  }

  
  async function downloadPDF() {
    const element = document.getElementById("report-content");
    if (!element) return;

    const opt = {
      margin: 10,
      filename: "Career-Report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  }

 
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#020617] text-white p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Detailed Career Report (₹49)
        </h1>

        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 p-6 rounded-xl space-y-6">

          <p className="text-center text-sm text-slate-300">
            <strong>Selected Careers:</strong>{" "}
            {selectedCareers.length > 0
              ? selectedCareers.join(", ")
              : "No careers found"}
          </p>

          <a
            href="https://rzp.io/l/YOUR_RAZORPAY_49_LINK"
            target="_blank"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-sm font-medium"
          >
            Pay ₹49 — Razorpay
          </a>

          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Generating Report..." : "I Paid — Generate Report"}
          </button>

          {report && (
            <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-lg space-y-4">

              {/* DOWNLOAD PDF */}
              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Download PDF
              </button>

              {/* REPORT CONTENT */}
              <div
                id="report-content"
                style={{
                  background: "white",
                  color: "black",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
              >
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>

            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
