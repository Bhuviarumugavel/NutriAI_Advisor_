"use client";

import { Camera, FileText } from "lucide-react";
import { useState } from "react";
import { getActiveUserId } from "@/lib/userClient";

export default function MealPlanPrompt() {
  const USER_ID = getActiveUserId();
  const [foodText, setFoodText] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [imageFile, setImageFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    setImageFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setAnalysis(null);
    setSuggestion(null);

    if (!foodText.trim() && !imageFile) {
      setError("Please enter a meal description or upload an image.");
      return;
    }

    try {
      setAnalyzing(true);
      setStatus("Analyzing meal with AI...");

      const analyzeBody = {
        food: foodText.trim() || (imageFile ? imageFile.name : "Meal upload"),
        userId: USER_ID
      };

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyzeBody)
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeData.success) {
        throw new Error(analyzeData.error || "Meal analysis failed.");
      }

      setAnalysis(analyzeData.analysis);
      setSuggestion(analyzeData.suggestion);
      setStatus("Saving meal to workbook...");

      const saveResponse = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          mealType,
          food: analyzeData.analysis.food || analyzeBody.food,
          calories: analyzeData.analysis.calories,
          protein: analyzeData.analysis.protein,
          carbs: analyzeData.analysis.carbs,
          fat: analyzeData.analysis.fat,
          fiber: analyzeData.analysis.fiber
        })
      });

      const saveData = await saveResponse.json();
      if (!saveData.success) {
        throw new Error(saveData.error || "Meal save failed.");
      }

      setStatus("✓ Meal analyzed and saved successfully!");
      setFoodText("");
      setImageFile(null);
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Camera size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Meal Image</h2>
            <p className="text-slate-500 mt-2">Add a photo to help identify the meal when text alone is not enough.</p>
          </div>
        </div>

        <label className="mt-8 block rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <span className="font-semibold text-emerald-600">Choose an image file</span>
          <p className="mt-3 text-sm text-slate-500">{imageFile ? imageFile.name : "No image selected"}</p>
        </label>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            <FileText size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Describe Your Meal</h2>
            <p className="text-slate-500 mt-2">Provide a quick description so the AI can estimate nutrition accurately.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-sm font-semibold text-slate-700">Meal type</span>
            <select
              value={mealType}
              onChange={(event) => setMealType(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </label>
          <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-sm font-semibold text-slate-700">Meal description</span>
            <textarea
              value={foodText}
              onChange={(event) => setFoodText(event.target.value)}
              placeholder="E.g. grilled chicken salad with avocado and quinoa"
              className="h-36 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {status && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div>}
        <button
          type="submit"
          disabled={analyzing}
          className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? "Analyzing..." : "Analyze and Save Meal"}
        </button>
      </div>

      {analysis && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900">Meal Analysis Result</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {analysis.calories} kcal
            </span>
          </div>
          <p className="mt-3 text-slate-700 font-medium">{analysis.food}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Calories:</span> {analysis.calories} kcal
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Protein:</span> {analysis.protein} g
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Carbs:</span> {analysis.carbs} g
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Fat:</span> {analysis.fat} g
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2">
              <span className="font-semibold text-slate-900">Fiber:</span> {analysis.fiber} g
            </div>
          </div>

          {analysis.suggestion && (
            <p className="mt-4 text-sm text-slate-600 italic">{analysis.suggestion}</p>
          )}
        </div>
      )}

      {suggestion && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="text-lg font-bold text-slate-900">🤖 AI Next Meal Suggestion</h3>
          {suggestion.mealName ? (
            <div className="mt-3 space-y-2">
              <p className="text-slate-800 font-semibold">{suggestion.mealName}</p>
              <p className="text-slate-600 text-sm">{suggestion.description}</p>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-emerald-700">Why: </span>{suggestion.reason}
              </p>
              {suggestion.tips?.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {suggestion.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-600">💡</span> {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-2 text-slate-600">{typeof suggestion === "string" ? suggestion : "Try balancing protein and vegetables."}</p>
          )}
        </div>
      )}
    </form>
  );
}
