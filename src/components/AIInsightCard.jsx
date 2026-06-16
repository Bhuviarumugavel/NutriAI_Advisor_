"use client";

import Link from "next/link";

export default function AIInsightCard({ protein = 0, targetProtein = 110, aiSuggestion = null, loading = false }) {
  const proteinLeft = Math.max(targetProtein - protein, 0);
  const hasAISuggestion = aiSuggestion && aiSuggestion.mealName;

  return (
    <div className="bg-emerald-50 rounded-3xl p-6 shadow-lg border border-emerald-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">AI Insight</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {hasAISuggestion ? aiSuggestion.mealName : "Smart nutrition suggestion"}
          </h3>
        </div>
        <span className="rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
          {proteinLeft > 30 ? "High priority" : proteinLeft > 0 ? "Moderate" : "Complete"}
        </span>
      </div>

      {loading ? (
        <p className="mt-5 text-slate-600 leading-7">Loading AI insights...</p>
      ) : hasAISuggestion ? (
        <div className="mt-5 space-y-3">
          <p className="text-slate-700 leading-7">{aiSuggestion.description}</p>
          <p className="text-slate-600 leading-7 text-sm">
            <span className="font-semibold text-emerald-700">Why this meal: </span>
            {aiSuggestion.reason}
          </p>
          {aiSuggestion.tips?.length > 0 && (
            <ul className="space-y-1 mt-3">
              {aiSuggestion.tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
          {aiSuggestion.estimatedNutrition && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-2xl bg-white/70 p-2 text-center">
                <p className="text-xs text-slate-500">Cal</p>
                <p className="text-sm font-bold text-slate-900">{aiSuggestion.estimatedNutrition.calories}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-2 text-center">
                <p className="text-xs text-slate-500">Prot</p>
                <p className="text-sm font-bold text-slate-900">{aiSuggestion.estimatedNutrition.protein}g</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-2 text-center">
                <p className="text-xs text-slate-500">Carb</p>
                <p className="text-sm font-bold text-slate-900">{aiSuggestion.estimatedNutrition.carbs}g</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-2 text-center">
                <p className="text-xs text-slate-500">Fat</p>
                <p className="text-sm font-bold text-slate-900">{aiSuggestion.estimatedNutrition.fat}g</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-5 text-slate-700 leading-7">
          Your current protein intake is {protein}g. You need <span className="font-semibold text-emerald-700">{proteinLeft}g more protein</span> today to stay on track with your balanced meal plan.
        </p>
      )}

      <Link
        href="/meal"
        className="mt-6 inline-flex items-center rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        View meal suggestions →
      </Link>
    </div>
  );
}
