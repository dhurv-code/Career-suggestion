"use client";

import AuthGuard from "../components/AuthGuard";
import { auth, db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // ---------------- USER PROFILE DATA ----------------
  useEffect(() => {
    if (auth.currentUser) {
      setUserData({
        email: auth.currentUser.email,
        createdAt: auth.currentUser.metadata.creationTime,
        lastLogin: auth.currentUser.metadata.lastSignInTime,
      });
    }
  }, []);

  // ---------------- TEST HISTORY ----------------
  useEffect(() => {
    async function loadTests() {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "tests"),
        where("uid", "==", auth.currentUser.uid),
      );

      const snap = await getDocs(q);

      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTests(items);
    }

    loadTests();
  }, []);
  // ---------------- REPORT HISTORY ----------------
  useEffect(() => {
    async function loadReports() {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "reports"),
        where("uid", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);

      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(items);
    }

    loadReports();
  }, []);


  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto bg-slate-900 p-6 rounded-xl border border-slate-700">

          <h1 className="text-3xl font-bold mb-6 text-center">
            User Dashboard
          </h1>

          {/* ---------------- PROFILE ---------------- */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>

            {userData ? (
              <>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Created At:</strong> {userData.createdAt}</p>
                <p><strong>Last Login:</strong> {userData.lastLogin}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* ---------------- REPORTS SECTION ---------------- */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-2">My Reports</h2>

            {reports.length === 0 ? (
              <p className="text-slate-400">No reports generated yet.</p>
            ) : (
              <ul className="space-y-3">
                {reports.map((r, index) => (
                  <li key={r.id} className="p-3 bg-slate-900 rounded-md border border-slate-700">
                    <strong>Report #{index + 1}</strong>
                    <br />
                    <span className="text-xs text-slate-400">
                      {r.timestamp ? new Date(r.timestamp).toLocaleString() : "Unknown date"}
                    </span>

                    <div className="mt-3 flex gap-3">

                      {/* VIEW REPORT */}
                      <button
                        onClick={() => window.open(`/view-report?id=${r.id}`, "_blank")}
                        className="bg-blue-600 px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>

                      {/* DOWNLOAD PDF */}
                      <button
                        onClick={() => window.open(`/api/download-pdf?id=${r.id}`)}
                        className="bg-green-600 px-3 py-1 rounded text-sm"
                      >
                        Download PDF
                      </button>

                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>


          {/* ---------------- TEST HISTORY ---------------- */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-2">My Career Tests</h2>

            {tests.length === 0 ? (
              <p className="text-slate-400">No test history yet.</p>
            ) : (
              <ul className="space-y-2">
                {tests.map((t) => (
                  <li key={t.id} className="text-sm">
                    <strong>Top Match:</strong> {t.ranked?.[0]?.career} <br />
                    <strong>Date:</strong>{" "}
                    {t.timestamp?.toDate
                      ? new Date(t.timestamp.toDate()).toLocaleString()
                      : "Unknown"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ---------------- PAYMENT HISTORY ---------------- */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
            <p className="text-slate-400">Payment history will display after Razorpay setup.</p>
          </div>

        </div>
      </main>
    </AuthGuard>
  );
}
