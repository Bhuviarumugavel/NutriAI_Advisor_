"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const suggestions = {
  morning: [
    "Egg white omelette with spinach",
    "Greek yogurt with berries and nuts",
    "Protein oatmeal with chia seeds"
  ],
  afternoon: [
    "Grilled chicken salad with quinoa",
    "Salmon bowl with brown rice and veggies",
    "Lentil soup with a side salad"
  ],
  evening: [
    "Baked fish with steamed broccoli",
    "Tofu stir fry with mixed vegetables",
    "Vegetable curry with chickpeas"
  ],
  night: [
    "Warm vegetable broth",
    "Cottage cheese with cucumber",
    "Light grilled fish and greens"
  ]
};

function getTimeSegment() {
  const hour = new Date().getHours();

  if (hour < 11) return "morning";
  if (hour < 15) return "afternoon";
  if (hour < 19) return "evening";
  return "night";
}

function getHealthSuggestion(profile) {
  if (!profile?.healthConditions?.length) {
    return "Keep your meals balanced with lean protein, vegetables, and whole grains.";
  }

  const conditions = profile.healthConditions.map((item) => item.toLowerCase());

  if (conditions.includes("diabetes")) {
    return "Choose low-sugar, high-fiber protein meals such as legumes, fish, and leafy greens.";
  }

  if (conditions.includes("heart disease") || conditions.includes("high cholesterol")) {
    return "Focus on lean protein, high-fiber vegetables, and avoid processed fats.";
  }

  if (conditions.includes("hypertension") || conditions.includes("kidney disease")) {
    return "Select low-sodium protein sources and hydrate steadily throughout the day.";
  }

  if (conditions.includes("obesity")) {
    return "Choose high-protein, lower-carb meals to support healthy weight management.";
  }

  return "Plan meals around lean protein, vegetables, and whole grains for safer nutrition.";
}

import { getActiveUserId } from "@/lib/userClient";

export default function MealSuggestionCard() {
  const [dashboard, setDashboard] = useState(null);
  const USER_ID = getActiveUserId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const segment = getTimeSegment();
  const suggestionsForSegment = suggestions[segment] || suggestions.morning;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${USER_ID}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Unable to load dashboard data.");
        }

        setDashboard(result.dashboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [USER_ID]);

  const protein = dashboard?.protein ?? 0;
  const water = dashboard?.water ?? 0;
  const proteinTarget = 110;
  const waterTarget = 2500;
  const proteinPercent = Math.min(Math.round((protein / proteinTarget) * 100), 100);
  const waterPercent = Math.min(Math.round((water / waterTarget) * 100), 100);

  const hasNoMeals = !dashboard?.meals || dashboard.meals.length === 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Meal suggestion</p>
          <h2 className="text-2xl font-bold text-slate-900">{segment.charAt(0).toUpperCase() + segment.slice(1)} recommendations</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{segment}</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Protein today</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{protein}g</p>
          <p className="text-sm text-slate-500">{proteinPercent}% of target</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Water today</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{water} ml</p>
          <p className="text-sm text-slate-500">{waterPercent}% of target</p>
        </div>
      </div>

      <div className="mt-6 text-slate-600 leading-relaxed text-sm">
        {loading ? (
          "Loading suggestions..."
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <>
            {dashboard?.profile?.name && (
              <span className="font-bold text-slate-900 block mb-1">
                Hello, {dashboard.profile.name}!
              </span>
            )}
            {getHealthSuggestion(dashboard?.profile)}
            {hasNoMeals && (
              <span className="text-emerald-700 font-semibold block mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                📢 Reminder: You haven't logged any meals yet today. Please remember to update your meal inputs regularly in the 'AI Meal' tab so we can customize your dietician advice!
              </span>
            )}
          </>
        )}
      </div>

      <ul className="mt-5 space-y-3">
        {suggestionsForSegment.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700">
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/meal"
        className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Add this meal →
      </Link>
    </div>
  );
}
