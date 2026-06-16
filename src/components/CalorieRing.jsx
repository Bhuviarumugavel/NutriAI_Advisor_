"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CalorieRing({ consumed = 0, target = 2000, loading = false }) {
  const remaining = Math.max(target - consumed, 0);
  const percentage = Math.min(Math.round((consumed / target) * 100), 100);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Calories Remaining</p>
          <h2 className="text-2xl font-bold text-slate-900">Daily Energy</h2>
        </div>
        <div className="w-24 rounded-3xl bg-emerald-50 px-4 py-2 text-center text-emerald-700">
          {loading ? "..." : `${100 - percentage}% left`}
        </div>
      </div>

      <div className="mx-auto mt-6 w-52 h-52">
        <CircularProgressbar
          value={percentage}
          text={loading ? "..." : `${remaining}`}
          styles={buildStyles({
            textColor: "#0f172a",
            pathColor: percentage > 90 ? "#ef4444" : percentage > 70 ? "#f59e0b" : "#15803d",
            trailColor: "#e2e8f0",
            textSize: "16px"
          })}
        />
      </div>

      <p className="text-center text-slate-500 mt-4">kcal left</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Eaten</p>
          <p className="text-3xl font-bold text-slate-900">{loading ? "..." : consumed}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Target</p>
          <p className="text-3xl font-bold text-slate-900">{loading ? "..." : target}</p>
        </div>
      </div>
    </div>
  );
}
