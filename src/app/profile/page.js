"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UserProfileCard from "@/components/UserProfileCard";
import useActiveUserId from "@/hooks/useActiveUserId";

export default function ProfilePage() {
  const userId = useActiveUserId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);
        const result = await response.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error("Profile page load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const dashboard = data?.dashboard || {};
  const meals = dashboard.meals || [];
  const healthScore = data?.healthScore || 75;
  const targetWater = data?.targets?.water || 2500;
  const targetCalories = data?.targets?.calories || 2000;
  const consumedWater = dashboard.water || 0;
  const consumedCalories = dashboard.calories || 0;

  const hydrationProgressPercent = Math.min(Math.round((consumedWater / targetWater) * 100), 100);
  const nutritionProgressPercent = Math.min(Math.round((consumedCalories / targetCalories) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Navbar title="Profile" subtitle="Personal health settings" />

      <main className="mx-auto max-w-6xl p-5 space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <UserProfileCard />

          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Goal</p>
                  <h2 className="text-xl font-bold text-slate-900">Daily Wellness</h2>
                </div>
                <span className={`rounded-3xl px-4 py-2 font-semibold text-sm ${healthScore >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {loading ? "..." : healthScore >= 70 ? "On track" : "Needs attention"}
                </span>
              </div>
              <p className="text-slate-500 mt-4">
                {loading
                  ? "Loading wellness score..."
                  : `Your daily health score is currently ${healthScore}/100. ${healthScore >= 70 ? "You are doing great with hydration and macros!" : "Try logging your meals and drinking more water to boost your score."}`}
              </p>
            </div>

            <div className="grid gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Health Score</h3>
                <div className="mt-4 flex items-center gap-5">
                  <div className={`rounded-3xl px-6 py-4 text-4xl font-extrabold shadow-sm ${
                    healthScore >= 85 ? "bg-emerald-100 text-emerald-700" :
                    healthScore >= 65 ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {loading ? "..." : healthScore}
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold">Wellness Rating</p>
                    <p className="text-xs text-slate-400 mt-1">Calculated from dynamic daily hydration & calorie/macro achievements.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Progress Tracker</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-sm text-slate-500">Today's Hydration</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">{loading ? "..." : `${hydrationProgressPercent}%`}</p>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${hydrationProgressPercent}%` }} />
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-sm text-slate-500">Today's Calories</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">{loading ? "..." : `${nutritionProgressPercent}%`}</p>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${nutritionProgressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal History Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 mt-5">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Meal History Logs</h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading meal logs...</p>
          ) : meals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left">
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Meal Type</th>
                    <th className="py-3 font-semibold">Food Items</th>
                    <th className="py-3 font-semibold text-right">Calories</th>
                    <th className="py-3 font-semibold text-right">Protein</th>
                    <th className="py-3 font-semibold text-right">Carbs</th>
                    <th className="py-3 font-semibold text-right">Fat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {meals.map((meal, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3">{meal.date}</td>
                      <td className="py-3 capitalize"><span className="inline-flex rounded-full px-2 py-0.5 bg-slate-100 font-semibold text-slate-600 text-xs">{meal.mealType}</span></td>
                      <td className="py-3 font-medium text-slate-900">{meal.food}</td>
                      <td className="py-3 text-right font-semibold text-slate-900">{meal.calories} kcal</td>
                      <td className="py-3 text-right">{meal.protein}g</td>
                      <td className="py-3 text-right">{meal.carbs}g</td>
                      <td className="py-3 text-right">{meal.fat}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">No meal records logged yet. Head over to the AI Meal tab to start logging!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
