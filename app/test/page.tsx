"use client";

import AuthGuard from "../components/AuthGuard";
import NeonBackground from "../components/NeonBackground";
import { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Answers = Record<string, number | string[] | string | null>;

export default function CareerTestPage() {
  
  const [results, setResults] = useState<{ career: string; score: number }[] | null>(null);
  const [saving, setSaving] = useState(false);
  const allCareers = [
    "Software Engineering",
    "Data & AI",
    "Cybersecurity",
    "Government Jobs",
    "Medical & Healthcare",
    "Business & Entrepreneurship",
    "Finance & Accounting",
    "Teaching & Education",
    "Creative & Content",
    "Engineering (Core)",
    "Law & Judiciary",
    "Arts & Design",
    "Aviation & Travel",
    "Hospitality & Hotel",
    "Sports & Fitness",
    "Agriculture & Environment",
    "Manufacturing & Production",
    "Marketing & Sales",
    "Logistics & Supply Chain",
    "Mass Media & Communication",
    "Biotechnology & Research",
    "Customer Support / HR",
    "Skilled Trades",
    "Real Estate & Property",
    "Freelancing / Online Career",
  ];
  const sliderGroups: [string, string[]][] = [
    ["Core Interests", [
      "problem_solving|Problem Solving",
      "creativity|Creativity",
      "people_skill|People & Communication",
      "leadership|Leadership",
      "discipline|Discipline / Consistency",
      "entrepreneurial_drive|Interest in Business",
    ]],
    ["Abilities & Comfort", [
      "math_comfort|Math & Analytical Comfort",
      "technical_interest|Tech / Coding Interest",
      "design_aptitude|Design / Visual Aptitude",
      "mechanical_aptitude|Mechanical / Hands-on Aptitude",
      "physical_fitness|Physical / Sports Affinity",
    ]],
    ["Values & Preferences", [
      "job_security_pref|Preference for Job Security",
      "freedom_pref|Preference for Freedom / Freelancing",
      "helping_nature|Helping / Service Orientation",
      "rule_preference|Preference for Clear Rules & Structure",
      "stress_tolerance|Stress Tolerance",
    ]],
    ["Specialized Interests", [
      "medical_interest|Medical / Biology Interest",
      "law_interest|Interest in Law / Debating",
      "finance_interest|Interest in Finance / Markets",
      "media_interest|Interest in Media / Communication",
    ]],
  ];
  const defaultValues: Record<string, number> = {
    problem_solving: 3,
    creativity: 3,
    people_skill: 3,
    leadership: 3,
    discipline: 3,
    entrepreneurial_drive: 2,
    math_comfort: 3,
    technical_interest: 3,
    design_aptitude: 3,
    mechanical_aptitude: 2,
    physical_fitness: 2,
    job_security_pref: 3,
    freedom_pref: 3,
    helping_nature: 3,
    rule_preference: 3,
    stress_tolerance: 3,
    medical_interest: 1,
    law_interest: 1,
    finance_interest: 1,
    media_interest: 1,
  };
  function scoreCareers(answers: any) {
    const a = answers as Record<string, number | string[]>;
    const s: Record<string, number> = {};
    const v = (k: string) => Number(a[k] ?? 0);
    s["Software Engineering"] =
      2 * v("technical_interest") + 1.5 * v("problem_solving") + 0.8 * v("math_comfort") + v("discipline");

    s["Data & AI"] =
      2 * v("math_comfort") + 1.8 * v("technical_interest") + 1.2 * v("problem_solving");

    s["Cybersecurity"] =
      2 * v("technical_interest") + 1.2 * v("problem_solving") + v("stress_tolerance");

    s["Government Jobs"] =
      2 * v("rule_preference") + 1.4 * v("job_security_pref") + v("discipline");

    s["Medical & Healthcare"] =
      2 * v("medical_interest") + 1.5 * v("helping_nature") + v("stress_tolerance");

    s["Business & Entrepreneurship"] =
      2 * v("entrepreneurial_drive") + 1.5 * v("leadership") + v("creativity");

    s["Finance & Accounting"] =
      2 * v("finance_interest") + 1.5 * v("discipline") + v("math_comfort");

    s["Teaching & Education"] =
      2 * v("people_skill") + 1.5 * v("helping_nature") + v("leadership");

    s["Creative & Content"] =
      2 * v("creativity") + 1.5 * v("media_interest") + v("people_skill");

    s["Engineering (Core)"] =
      2 * v("mechanical_aptitude") + 1.2 * v("technical_interest") + v("problem_solving");

    s["Law & Judiciary"] =
      2 * v("law_interest") + 1.5 * v("people_skill") + v("discipline");

    s["Arts & Design"] =
      2 * v("design_aptitude") + 1.2 * v("creativity") + v("people_skill");

    s["Aviation & Travel"] =
      2 * v("technical_interest") + 1.2 * v("stress_tolerance") + v("people_skill");

    s["Hospitality & Hotel"] =
      2 * v("people_skill") + 1.2 * v("stress_tolerance") + v("discipline");

    s["Sports & Fitness"] =
      2 * v("physical_fitness") + 1.2 * v("discipline") + v("stress_tolerance");

    s["Agriculture & Environment"] =
      2 * v("mechanical_aptitude") + 1.2 * v("helping_nature") + v("discipline");

    s["Manufacturing & Production"] =
      2 * v("mechanical_aptitude") + 1.2 * v("discipline") + v("technical_interest");

    s["Marketing & Sales"] =
      2 * v("people_skill") + 1.2 * v("creativity") + v("entrepreneurial_drive");

    s["Logistics & Supply Chain"] =
      2 * v("discipline") + 1.2 * v("mechanical_aptitude") + v("problem_solving");

    s["Mass Media & Communication"] =
      2 * v("media_interest") + 1.2 * v("creativity") + v("people_skill");

    s["Biotechnology & Research"] =
      2 * v("medical_interest") + 1.5 * v("problem_solving") + v("technical_interest");

    s["Customer Support / HR"] =
      2 * v("people_skill") + 1.2 * v("discipline") + v("helping_nature");

    s["Skilled Trades"] =
      2 * v("mechanical_aptitude") + 1.2 * v("discipline") + v("technical_interest");

    s["Real Estate & Property"] =
      2 * v("people_skill") + 1.2 * v("entrepreneurial_drive") + v("discipline");

    s["Freelancing / Online Career"] =
      2 * v("freedom_pref") + 1.2 * Math.max(v("technical_interest"), v("design_aptitude"), v("media_interest")) + v("entrepreneurial_drive");

    for (const c of allCareers) {
      if (typeof s[c] === "undefined") s[c] = 0;
    }
    return Object.entries(s)
      .map(([career, score]) => ({ career, score: Number(score.toFixed(2)) }))
      .sort((a, b) => b.score - a.score);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);

    const answers: any = {};
    Object.keys(defaultValues).forEach((k) => {
      answers[k] = Number(form.get(k) ?? defaultValues[k]);
    });

    ["problem_solving", "creativity", "people_skill", "leadership", "discipline", "entrepreneurial_drive",
      "math_comfort", "technical_interest", "design_aptitude", "mechanical_aptitude", "physical_fitness",
      "job_security_pref", "freedom_pref", "helping_nature", "rule_preference", "stress_tolerance",
      "medical_interest", "law_interest", "finance_interest", "media_interest"
    ].forEach((k) => {
      if (!(k in answers)) answers[k] = Number(form.get(k) ?? 3);
    });

    const selected_careers = form.getAll("selected_careers") as string[];
    answers.selected_careers = selected_careers;

    answers.notes = String(form.get("notes") || "");
    answers.priorities = form.getAll("priorities");

    const ranked = scoreCareers(answers);
    setResults(ranked);

    if (auth.currentUser) {
      try {
        setSaving(true);
        await addDoc(collection(db, "tests"), {
          uid: auth.currentUser.uid,
          answers,
          ranked,
          notes: answers.notes,
          selected_careers,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error("SAVE TEST FAILED:", err);
      } finally {
        setSaving(false);
      }
    }
  }

  return (
    <AuthGuard>
      <NeonBackground>
        <main className="min-h-screen px-6 py-12">
          <h1 className="text-3xl font-bold text-center mb-6">Career Preference Test</h1>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[rgba(255,255,255,0.03)] border border-[#2b2740] p-6 rounded-2xl space-y-6 shadow-2xl">
            {/* Sliders - grouped */}
            {sliderGroups.map(([groupTitle, sliders], idx) => (
              <section key={groupTitle}>
                <h2 className="text-lg font-semibold mb-3">{groupTitle}</h2>
                <div className="grid gap-4">
                  {sliders.map((s) => {
                    const [name, label] = (s as string).split("|");
                    return (
                      <div key={name} className="flex flex-col gap-2">
                        <label className="text-sm text-slate-300 flex justify-between">
                          <span>{label}</span>
                          <span className="text-xs text-slate-400">0 — 5</span>
                        </label>
                        <input type="range" name={name} min={0} max={5} defaultValue={defaultValues[name] ?? 3} className="w-full" />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-lg font-semibold mb-3">Which career clusters interest you? (choose 2+)</h2>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {allCareers.map((career) => (
                  <label key={career} className="flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(255,255,255,0.01)]">
                    <input name="selected_careers" type="checkbox" value={career} className="w-4 h-4" />
                    <span className="text-slate-200">{career}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Notes / Priorities (optional)</h2>
              <textarea name="notes" placeholder="Any preferences or constraints (location, salary, study plans)?" className="w-full bg-[#04040a] border border-slate-800 p-3 rounded-md text-sm text-slate-200" rows={3} />
            </section>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] py-3 rounded-lg font-medium" type="submit">
                {saving ? "Saving…" : "Get Recommendation"}
              </button>

              <button type="button" onClick={() => { setResults(null); (document.querySelector('form') as HTMLFormElement)?.reset(); }} className="px-4 py-3 rounded-lg border border-slate-700 text-sm">
                Reset
              </button>
            </div>
          </form>

          {results && (
            <div className="max-w-4xl mx-auto mt-8 bg-[rgba(255,255,255,0.03)] border border-[#2b2740] p-6 rounded-2xl">

              <h2 className="text-xl font-semibold mb-3">Your Top Career Matches</h2>

              {results.slice(0, 6).map((r, i) => (
                <div key={r.career} className="p-3 rounded-md bg-[#030313] border border-slate-800">
                  <div className="text-sm text-slate-400">#{i + 1}</div>
                  <div className="font-medium text-slate-100">{r.career}</div>
                  <div className="text-xs text-slate-400">Score: {r.score}</div>
                </div>
              ))}

             
              <a
                href={`/report?careers=${encodeURIComponent(JSON.stringify(
                  results.slice(0, 3).map((x) => x.career)
                ))}`}
                className="mt-6 inline-block bg-indigo-600 px-4 py-2 rounded-lg text-sm"
              >
                Get Detailed Report (₹49)
              </a>

            </div>
          )}

        </main>
      </NeonBackground>
    </AuthGuard>
  );
}
