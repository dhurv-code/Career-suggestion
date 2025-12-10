export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 pt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Pricing</h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">

        {/* FREE PLAN */}
        <div className="border border-slate-700 rounded-2xl p-6 bg-slate-900">
          <h3 className="text-lg font-medium mb-2">Free</h3>
          <p className="text-3xl font-bold mb-4">₹0</p>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Basic career ranking</li>
            <li>• Top 3 matches</li>
            <li>• Basic explanation</li>
          </ul>
        </div>

        {/* AI REPORT */}
        <div className="border border-indigo-600 rounded-2xl p-6 bg-slate-900 shadow-lg shadow-indigo-900/40">
          <h3 className="text-lg font-medium mb-2">AI Detailed Report</h3>
          <p className="text-3xl font-bold mb-4">₹49</p>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Full AI explanation</li>
            <li>• Strengths & weaknesses</li>
            <li>• Skill-gap analysis</li>
            <li>• Career comparison</li>
            <li>• 30/60/90 day roadmap</li>
          </ul>
        </div>

        {/* MENTOR SESSION */}
        <div className="border border-slate-700 rounded-2xl p-6 bg-slate-900">
          <h3 className="text-lg font-medium mb-2">Mentor Session</h3>
          <p className="text-3xl font-bold mb-4">₹99</p>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Everything in AI report</li>
            <li>• 1:1 live call</li>
            <li>• Personalized career roadmap</li>
            <li>• Expert guidance</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
