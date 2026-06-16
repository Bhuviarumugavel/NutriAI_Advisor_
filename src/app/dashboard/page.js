"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import useActiveUserId from "@/hooks/useActiveUserId";
import CalorieRing from "@/components/CalorieRing";
import AIInsightCard from "@/components/AIInsightCard";
import NutritionCard from "@/components/NutritionCard";
import WeeklyTrendChart from "@/components/WeeklyTrendChart";
import MealSuggestionCard from "@/components/MealSuggestionCard";
import WaterTracker from "@/components/WaterTracker";
import ProfileSavedCard from "@/components/ProfileSavedCard";

export default function DashboardPage() {
  const USER_ID = useActiveUserId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${USER_ID}`);
        const result = await response.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [USER_ID]);

  const dashboard = data?.dashboard || {};
  const targets = data?.targets || { calories: 2000, protein: 110, carbs: 250, fat: 65, water: 2500 };
  const caloriesLeft = Math.max(targets.calories - (dashboard.calories || 0), 0);
  const proteinConsumed = dashboard.protein || 0;
  const waterConsumed = dashboard.water || 0;
  const caloriesConsumed = dashboard.calories || 0;
  const carbsConsumed = dashboard.carbs || 0;
  const fatConsumed = dashboard.fat || 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Navbar title="Dashboard" subtitle="Personalized meal suggestions for today" />

      <main className="mx-auto max-w-6xl p-5 space-y-6">
        <section className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Overview</p>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              </div>
              <span className="inline-flex rounded-3xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {loading ? "Loading..." : data?.summary?.caloriesStatus === "Optimal" ? "On Track" : "Balanced Nutrition Plan"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Calories left</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : caloriesLeft}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Protein</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : `${proteinConsumed}g`}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Hydration</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : `${(waterConsumed / 1000).toFixed(1)}L`}
                </p>
              </div>
            </div>
          </div>

          <CalorieRing
            consumed={caloriesConsumed}
            target={targets.calories}
            loading={loading}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
          <AIInsightCard
            protein={proteinConsumed}
            targetProtein={targets.protein}
            aiSuggestion={data?.aiSuggestion}
            loading={loading}
          />
          <MealSuggestionCard />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
          <ProfileSavedCard />
          <WaterTracker />
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Macro Progress</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {loading ? "..." : data?.summary?.proteinStatus || "Tracking"}
            </span>
          </div>
          <div className="mt-5 space-y-5">
            <NutritionCard title="Protein" current={proteinConsumed} total={targets.protein} />
            <NutritionCard title="Carbs" current={carbsConsumed} total={targets.carbs} />
            <NutritionCard title="Fats" current={fatConsumed} total={targets.fat} />
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Weekly Trends</h2>
          <WeeklyTrendChart />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
